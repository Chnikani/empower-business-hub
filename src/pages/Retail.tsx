
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, BarChart3, CreditCard } from "lucide-react";

const Retail = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Retail & E-commerce</h1>
        <p className="text-muted-foreground">
          Manage your inventory, process orders, and track sales performance.
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card className="text-center py-12">
        <CardContent>
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-4">Retail Module Coming Soon</CardTitle>
          <CardDescription className="mb-6 max-w-md mx-auto">
            We're developing a complete retail solution that will include:
          </CardDescription>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto mb-8">
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <Package className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Inventory Management</h4>
              <p className="text-sm text-muted-foreground text-center">Track stock levels and products</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <ShoppingCart className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Order Processing</h4>
              <p className="text-sm text-muted-foreground text-center">Handle customer orders efficiently</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <CreditCard className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Payment Processing</h4>
              <p className="text-sm text-muted-foreground text-center">Accept payments seamlessly</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-medium">Sales Analytics</h4>
              <p className="text-sm text-muted-foreground text-center">Track performance and trends</p>
            </div>
          </div>
          <Button>
            Join Beta Program
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Retail;
