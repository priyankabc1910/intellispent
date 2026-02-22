import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "@/context/AnalysisContext";
import { AnalysisResult } from "@/types/analysis";

export default function AddTransaction() {
  const [income, setIncome] = useState("");
  const [categories, setCategories] = useState<
    { name: string; amount: string }[]
  >([
    { name: "Rent", amount: "" },
    { name: "Food", amount: "" },
    { name: "Entertainment", amount: "" },
    { name: "Shopping", amount: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setResult, setIncome: setCtxIncome, setExpenses: setCtxExpenses } =
    useAnalysis();
  const navigate = useNavigate();

  const addCategory = () => {
    setCategories([...categories, { name: "", amount: "" }]);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (
    index: number,
    field: "name" | "amount",
    value: string
  ) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const preview = useMemo(() => {
    const inc = parseFloat(income) || 0;
    const total = categories.reduce(
      (sum, cat) => sum + (parseFloat(cat.amount) || 0),
      0
    );
    const savings = inc - total;
    const ratio = inc > 0 ? ((savings / inc) * 100).toFixed(1) : "0.0";
    return { total, savings, ratio };
  }, [income, categories]);

  const handleAnalyze = async () => {
    setError("");

    const incomeVal = parseFloat(income);
    if (!incomeVal || incomeVal <= 0) {
      setError("Please enter a valid income.");
      return;
    }

    const expenseMap: Record<string, number> = {};
    categories.forEach((cat) => {
      const name = cat.name.trim().toLowerCase();
      const amount = parseFloat(cat.amount) || 0;
      if (name && amount > 0) {
        expenseMap[name] = (expenseMap[name] || 0) + amount;
      }
    });

    if (Object.keys(expenseMap).length === 0) {
      setError("Add at least one expense category.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://intellispent.onrender.com/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            income: incomeVal,
            expenses: expenseMap,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Server error");
      }

      const data: AnalysisResult = await res.json();

      setResult(data);
      setCtxIncome(incomeVal);
      setCtxExpenses(expenseMap);

      navigate("/");
    } catch (err: any) {
      console.error("API ERROR:", err);
      setError("Error: " + (err.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="space-y-8">

    <div>
      <h1 className="text-2xl font-bold text-black">Add Transactions</h1>
      <p className="text-muted-foreground text-sm">
        Enter your monthly income and expenses.
      </p>
    </div>

    {/* Main Glass Card */}
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 space-y-8 shadow-xl">

      {/* Income Section */}
      <div>
        <label className="block text-sm mb-2 text-muted-foreground">
          Monthly Income
        </label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="Enter income"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories Section */}
      <div>
        <label className="block text-sm mb-4 text-muted-foreground">
          Expense Categories
        </label>

        <div className="space-y-4">
          {categories.map((cat, i) => (
            <div key={i} className="flex gap-4">
              <input
                type="text"
                value={cat.name}
                placeholder="Category"
                onChange={(e) =>
                  updateCategory(i, "name", e.target.value)
                }
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="number"
                value={cat.amount}
                placeholder="Amount"
                onChange={(e) =>
                  updateCategory(i, "amount", e.target.value)
                }
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => removeCategory(i)}
                className="px-4 bg-red-600 hover:bg-red-700 rounded-xl text-white"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addCategory}
          className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          Add Category
        </button>
      </div>

      {/* Preview Section */}
      <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800">
        <div>
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-xl font-bold text-white">
            ₹ {preview.total}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Estimated Savings</p>
          <p className="text-xl font-bold text-white">
            ₹ {preview.savings}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Savings Ratio</p>
          <p className="text-xl font-bold text-white ">
            {preview.ratio}%
          </p>
        </div>
      </div>

      {error && (
        <div className="text-red-400 font-medium pt-4">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
      >
        {loading ? "Analyzing..." : "Analyze Financial Health"}
      </button>
    </div>
  </div>
);
}