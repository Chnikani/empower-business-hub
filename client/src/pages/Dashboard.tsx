import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Globe, ArrowRight } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 12000, expenses: 8000 },
  { month: "Feb", revenue: 15000, expenses: 9000 },
  { month: "Mar", revenue: 18000, expenses: 11000 },
  { month: "Apr", revenue: 16000, expenses: 10000 },
  { month: "May", revenue: 20000, expenses: 12000 },
  { month: "Jun", revenue: 22000, expenses: 13000 },
];

const customerData = [
  { name: "New Customers", value: 45, color: "hsl(220, 91%, 52%)" },
  { name: "Returning", value: 35, color: "hsl(25, 95%, 53%)" },
  { name: "Inactive", value: 20, color: "hsl(220, 14%, 96%)" },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 rounded-lg">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl -z-10" />
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Business Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your business today.
              </p>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              All systems operational
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="modern-card hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-success to-success/80 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$103,000</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">248</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="modern-card hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-warning to-warning/80 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              $15,600 total value
            </p>
          </CardContent>
        </Card>

        <Card className="modern-card hover-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Website Visitors</CardTitle>
            <div className="h-8 w-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
              <Globe className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,241</div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +7% from last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="modern-card col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
                <BarChart className="h-3 w-3 text-white" />
              </div>
              Revenue vs Expenses
            </CardTitle>
            <CardDescription>Monthly comparison for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(220, 91%, 52%)" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(25, 95%, 53%)" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gradient-to-br from-accent to-primary rounded-md flex items-center justify-center">
                <Users className="h-3 w-3 text-white" />
              </div>
              Customer Segments
            </CardTitle>
            <CardDescription>Customer distribution breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="modern-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
              <ArrowRight className="h-3 w-3 text-white" />
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription>Jump into your most common business tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Create Invoice", desc: "Send invoices to customers", icon: "💰" },
              { title: "Add Contact", desc: "Expand your CRM database", icon: "👥" },
              { title: "Create Document", desc: "Start a new knowledge base entry", icon: "📝" },
              { title: "Build Website", desc: "Create your online presence", icon: "🌐" }
            ].map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 hover-lift hover:bg-accent/5 hover:border-primary/20"
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
