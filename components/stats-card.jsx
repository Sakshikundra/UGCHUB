import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Users, Briefcase, DollarSign, Activity } from "lucide-react";

const icons = {
  users: Users,
  briefcase: Briefcase,
  dollar: DollarSign,
  activity: Activity,
};

export function StatsCard({ title, value, icon, description, trend }) {
  const Icon = icons[icon] || Activity;
  
  return (
    <Card className="glass border-purple-500/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-200">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-purple-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {description && (
          <p className="text-xs text-gray-400 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
