export type Profile = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  phone: string;
  email: string;
  department: string | null;
  designation: string | null;
  role: string;
  profile_photo: string | null;
  created_at: string;
  updated_at: string;
};

// Fields the user is actually allowed to edit from the profile page.
// department, designation, and role are admin-assigned and excluded.
export type EditableProfileFields = Pick<
  Profile,
  "first_name" | "middle_name" | "last_name" | "phone"
>;