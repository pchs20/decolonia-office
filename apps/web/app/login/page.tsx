import { signIn } from "@/auth";
import { LoginForm } from "@/presentation/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const accessDenied = error === "AccessDenied";

  const action = async () => {
    "use server";
    await signIn("google", { redirectTo: "/" });
  };

  return <LoginForm accessDenied={accessDenied} action={action} />;
}


