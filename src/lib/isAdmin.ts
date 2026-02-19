export const isAdminEmail = (email?: string | null) => {
  if (!email) return false;

  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(email);
};
