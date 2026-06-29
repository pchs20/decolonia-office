import { BudgetListPage } from "@/presentation/components/budgets/BudgetListPage";

interface BudgetsPageProps {
  searchParams: Promise<{ clientId?: string }>;
}

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
  const { clientId } = await searchParams;

  return (
    <div className="p-4 md:p-6">
      <BudgetListPage clientId={clientId} />
    </div>
  );
}
