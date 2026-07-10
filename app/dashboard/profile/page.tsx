"use client";

import { useEffect, useState } from "react";
import { Pencil, X, Loader2 } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/providers/AuthProvider";
import type { Profile, EditableProfileFields } from "@/lib/types/profile";

export default function ProfilePage() {
  const supabase = createClient();
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<EditableProfileFields>({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();

      if (cancelled) return;

      if (error) {
        setLoadError("Couldn't load your profile. Try refreshing the page.");
      } else if (data) {
        setProfile(data as Profile);
        setFormValues({
          first_name: data.first_name ?? "",
          middle_name: data.middle_name ?? "",
          last_name: data.last_name ?? "",
          phone: data.phone ?? "",
        });
      }
      setIsLoading(false);
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  function startEditing() {
    if (!profile) return;
    setFormValues({
      first_name: profile.first_name ?? "",
      middle_name: profile.middle_name ?? "",
      last_name: profile.last_name ?? "",
      phone: profile.phone ?? "",
    });
    setAvatarFile(null);
    setSaveError("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setAvatarFile(null);
    setSaveError("");
  }

  function updateField<K extends keyof EditableProfileFields>(
    field: K,
    value: EditableProfileFields[K]
  ) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;

    setSaveError("");

    if (!formValues.first_name.trim()) {
      setSaveError("First name is required.");
      return;
    }
    if (!formValues.last_name.trim()) {
      setSaveError("Last name is required.");
      return;
    }
    if (!formValues.phone.trim()) {
      setSaveError("Phone number is required.");
      return;
    }

    setIsSaving(true);

    let photoUrl = profile.profile_photo;

    // Upload the new photo first, if one was picked. Path is namespaced
    // under the user's own id to satisfy the storage RLS policy.
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });
        const result = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

        console.log(result);
      if (uploadError) {
        setIsSaving(false);
        setSaveError(`Photo upload failed: ${uploadError.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      photoUrl = publicUrlData.publicUrl;
    }

    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: formValues.first_name.trim(),
        middle_name: formValues.middle_name.trim() || null,
        last_name: formValues.last_name.trim(),
        phone: formValues.phone.trim(),
        profile_photo: photoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    setIsSaving(false);

    if (updateError) {
      setSaveError(updateError.message);
      return;
    }

    setProfile(updated as Profile);
    setAvatarFile(null);
    setIsEditing(false);
  }

  const initials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase()
    : "";

  return (
    <DashboardShell pageTitle="Profile">
      <div className="mx-auto max-w-2xl">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-[#6B655A] dark:text-[#8FA79C]">
            <Loader2 size={16} className="animate-spin" />
            Loading your profile…
          </div>
        ) : loadError ? (
          <p className="text-sm text-[#A3402F] dark:text-[#E0836F]">
            {loadError}
          </p>
        ) : profile ? (
          <div className="rounded-lg border border-[#E4DFD1] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] p-6 sm:p-8">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl text-[#211E19] dark:text-[#E8E3D8]">
                    Edit profile
                  </h2>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#6B655A] dark:text-[#8FA79C] hover:bg-[#EDE8DA] dark:hover:bg-[#1C2E27]"
                    aria-label="Cancel editing"
                  >
                    <X size={16} />
                  </button>
                </div>

                <AvatarUpload
                  currentPhotoUrl={profile.profile_photo}
                  displayInitials={initials}
                  onFileSelected={setAvatarFile}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="First name"
                    id="first_name"
                    value={formValues.first_name}
                    onChange={(v) => updateField("first_name", v)}
                    autoComplete="given-name"
                  />
                  <Field
                    label="Last name"
                    id="last_name"
                    value={formValues.last_name}
                    onChange={(v) => updateField("last_name", v)}
                    autoComplete="family-name"
                  />
                </div>

                <Field
                  label="Middle name (optional)"
                  id="middle_name"
                  value={formValues.middle_name ?? ""}
                  onChange={(v) => updateField("middle_name", v)}
                  autoComplete="additional-name"
                />

                <Field
                  label="Phone number"
                  id="phone"
                  value={formValues.phone}
                  onChange={(v) => updateField("phone", v)}
                  autoComplete="tel"
                  type="tel"
                />

                {saveError && (
                  <p role="alert" className="text-sm text-[#A3402F] dark:text-[#E0836F]">
                    {saveError}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-md bg-[#211E19] dark:bg-[#C9A46A] text-[#F6F3EC] dark:text-[#0F1613] px-5 py-2.5 text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {isSaving ? "Saving…" : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] px-5 py-2.5 text-sm text-[#211E19] dark:text-[#E8E3D8] hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl text-[#211E19] dark:text-[#E8E3D8]">
                    Your profile
                  </h2>
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-2 rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] px-3 py-1.5 text-sm text-[#211E19] dark:text-[#E8E3D8] hover:bg-[#F1EDE1] dark:hover:bg-[#1C2E27]"
                  >
                    <Pencil size={14} />
                    Edit profile
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full overflow-hidden border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#211E19] dark:bg-[#C9A46A]/20 flex items-center justify-center shrink-0">
                    {profile.profile_photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.profile_photo}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-serif text-2xl text-[#F6F3EC] dark:text-[#C9A46A]">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-serif text-lg text-[#211E19] dark:text-[#E8E3D8]">
                      {[profile.first_name, profile.middle_name, profile.last_name]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                    <p className="text-sm text-[#6B655A] dark:text-[#8FA79C]">
                      {profile.designation ?? "Designation not assigned yet"}
                    </p>
                  </div>
                </div>

                <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <ReadOnlyItem label="First name" value={profile.first_name} />
                  <ReadOnlyItem label="Last name" value={profile.last_name} />
                  <ReadOnlyItem
                    label="Middle name"
                    value={profile.middle_name || "—"}
                  />
                  <ReadOnlyItem label="Phone number" value={profile.phone} />
                  <ReadOnlyItem label="Email" value={profile.email} note="read-only" />
                  <ReadOnlyItem
                    label="Department"
                    value={profile.department || "Not assigned"}
                    note="set by admin"
                  />
                  <ReadOnlyItem
                    label="Designation"
                    value={profile.designation || "Not assigned"}
                    note="set by admin"
                  />
                  <ReadOnlyItem label="Role" value={profile.role} note="set by admin" />
                </dl>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}

type FieldProps = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  type?: string;
};

function Field({ label, id, value, onChange, autoComplete, type = "text" }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-[0.12em] text-[#6B655A] dark:text-[#8FA79C] mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#D8D2C2] dark:border-[#2A3A34] bg-[#FCFAF5] dark:bg-[#17211D] px-4 py-2.5 text-[#211E19] dark:text-[#E8E3D8] text-[15px] outline-none transition-colors focus:border-[#8A6B3B] dark:focus:border-[#C9A46A] focus:ring-2 focus:ring-[#8A6B3B]/20 dark:focus:ring-[#C9A46A]/20"
      />
    </div>
  );
}

function ReadOnlyItem({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.1em] text-[#A79F8E] flex items-center gap-1.5">
        {label}
        {note && <span className="normal-case text-[#A79F8E]">({note})</span>}
      </dt>
      <dd className="mt-1 text-sm text-[#211E19] dark:text-[#E8E3D8]">
        {value}
      </dd>
    </div>
  );
}