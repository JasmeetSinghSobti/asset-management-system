import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';
import { canAssignRole, ROLE_LABELS } from '@/lib/roles';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { firstName, middleName, lastName, phone, email, department, designation, role } =
    body ?? {};

  if (!firstName || !lastName || !email || !role) {
    return NextResponse.json(
      { error: 'First name, last name, email, and role are required.' },
      { status: 400 }
    );
  }

  // --- 1. Identify the caller from their own session cookies. ---
  // Swap this block for your existing `@/lib/supabase/server` helper
  // if you already have one — this is a self-contained fallback.
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

  const {
    data: { user: caller },
  } = await supabase.auth.getUser();

  if (!caller) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', caller.id)
    .maybeSingle();

  const callerRole = callerProfile?.role ?? null;

  // --- 2. Re-check permission server-side. ---
  // This is the real security boundary — the role dropdown on the
  // client is just UX. Never trust `role` from the request body alone.
  if (!canAssignRole(callerRole, role)) {
    return NextResponse.json(
      { error: `You're not allowed to create a ${ROLE_LABELS[role] ?? role} account.` },
      { status: 403 }
    );
  }

  const admin = createAdminClient();

  // --- 3. Invite the user. Supabase emails them a link to set their ---
  // own password — the admin never has to invent or share one.
  const { data: created, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
    String(email).trim(),
    {
      data: {
        first_name: String(firstName).trim(),
        middle_name: middleName?.trim() || null,
        last_name: String(lastName).trim(),
        phone: phone?.trim() || null,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/set-password`,
    }
  );

  if (inviteError || !created?.user) {
    return NextResponse.json(
      { error: inviteError?.message ?? 'Could not invite user.' },
      { status: 400 }
    );
  }

  // --- 4. Set the fields only an admin should control. ---
  // The DB trigger already created a base `profiles` row from the
  // metadata above (defaulting role to 'employee', by design — see
  // the trigger's own comment). This update runs on the service-role
  // client, so it bypasses RLS safely, unlike a client-side write.
  const { error: updateError } = await admin
    .from('profiles')
    .update({
      role,
      department: department?.trim() || null,
      designation: designation?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', created.user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, userId: created.user.id });
}