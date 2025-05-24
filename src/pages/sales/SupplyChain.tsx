import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { 
  Truck, 
  Package, 
  Warehouse, 
  Store, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  BarChart4,
  Eye
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Sale } from "./types";
import { ProductType } from "../products/types";

// Define supply chain related types
export type SupplyChainNode = {
  id: string;
  name: string;
  type: "supplier" | "warehouse" | "distribution" | "retail";
  location: string;
  status: "active" | "inactive" | "issue";
};

export type SupplyRoute = {
  id: string;
  from: string; // Node ID
  to: string; // Node ID
  transportMethod: "truck" | "ship" | "air" | "rail";
  duration: number; // In hours
  distance: number; // In km
  status: "active" | "delayed" | "interrupted";
};

export type Shipment = {
  id: string;
  routeId: string;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
  departureDate: string;
  estimatedArrival: string;
  actualArrival?: string;
  status: "scheduled" | "in_transit" | "delivered" | "delayed" | "cancelled";
  trackingCode: string;
  relatedSaleIds?: number[]; // IDs of sales this shipment fulfills
};

// Mock data for initial setup
const initialNodes: SupplyChainNode[] = [
  {
    id: "sup-1",
    name: "Main Supplier Co.",
    type: "supplier",
    location: "Colombo, Sri Lanka",
    status: "active",
  },
  {
    id: "wh-1",
    name: "Central Warehouse",
    type: "warehouse",
    location: "Kandy, Sri Lanka",
    status: "active",
  },
  {
    id: "dist-1",
    name: "Northern Distribution",
    type: "distribution",
    location: "Jaffna, Sri Lanka",
    status: "active",
  },
  {
    id: "dist-2",
    name: "Southern Distribution",
    type: "distribution",
    location: "Galle, Sri Lanka",
    status: "issue",
  },
  {
    id: "ret-1",
    name: "Colombo Retail",
    type: "retail",
    location: "Colombo, Sri Lanka",
    status: "active",
  },
  {
    id: "ret-2",
    name: "Kandy Retail",
    type: "retail",
    location: "Kandy, Sri Lanka",
    status: "active",
  },
];

const initialRoutes: SupplyRoute[] = [
  {
    id: "route-1",
    from: "sup-1",
    to: "wh-1",
    transportMethod: "truck",
    duration: 4,
    distance: 120,
    status: "active",
  },
  {
    id: "route-2",
    from: "wh-1",
    to: "dist-1",
    transportMethod: "truck",
    duration: 6,
    distance: 220,
    status: "active",
  },
  {
    id: "route-3",
    from: "wh-1",
    to: "dist-2",
    transportMethod: "truck",
    duration: 5,
    distance: 180,
    status: "delayed",
  },
  {
    id: "route-4",
    from: "dist-1",
    to: "ret-1",
    transportMethod: "truck",
    duration: 3,
    distance: 90,
    status: "active",
  },
  {
    id: "route-5",
    from: "dist-2",
    to: "ret-2",
    transportMethod: "truck",
    duration: 2,
    distance: 60,
    status: "active",
  },
];

// Generate a random tracking code
const generateTrackingCode = () => {
  return `SC-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

// Helper to get a node by ID
const getNodeById = (nodes: SupplyChainNode[], id: string) => {
  return nodes.find(node => node.id === id);
};

// Helper to get a route by ID
const getRouteById = (routes: SupplyRoute[], id: string) => {
  return routes.find(route => route.id === id);
};

export default function SupplyChain() {
  // Local storage for persistent data
  const [nodes, setNodes] = useLocalStorage<SupplyChainNode[]>("supplyChainNodes", initialNodes);
  const [routes, setRoutes] = useLocalStorage<SupplyRoute[]>("supplyChainRoutes", initialRoutes);
  const [shipments, setShipments] = useLocalStorage<Shipment[]>("shipments", []);
  const [sales] = useLocalStorage<Sale[]>("sales", []);
  const [inventory] = useLocalStorage<ProductType[]>("inventory", []);
  
  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  
  // Stats for the overview
  const [stats, setStats] = useState({
    activeShipments: 0,
    delayedShipments: 0,
    completedShipments: 0,
    averageDeliveryTime: 0,
    onTimeDeliveryRate: 0,
  });
  
  // Calculate statistics
  useEffect(() => {
    const active = shipments.filter(s => s.status === "in_transit").length;
    const delayed = shipments.filter(s => s.status === "delayed").length;
    const completed = shipments.filter(s => s.status === "delivered").length;
    
    // Calculate average delivery time for completed shipments
    let totalDeliveryTime = 0;
    let onTimeCount = 0;
    
    shipments.forEach(shipment => {
      if (shipment.status === "delivered" && shipment.actualArrival) {
        const departureDate = new Date(shipment.departureDate);
        const arrivalDate = new Date(shipment.actualArrival);
        const estimatedDate = new Date(shipment.estimatedArrival);
        
        // Calculate delivery time in hours
        const deliveryTime = (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60);
        totalDeliveryTime += deliveryTime;
        
        // Check if delivered on time
        if (arrivalDate <= estimatedDate) {
          onTimeCount++;
        }
      }
    });
    
    const avgTime = completed > 0 ? totalDeliveryTime / completed : 0;
    const onTimeRate = completed > 0 ? (onTimeCount / completed) * 100 : 0;
    
    setStats({
      activeShipments: active,
      delayedShipments: delayed,
      completedShipments: completed,
      averageDeliveryTime: avgTime,
      onTimeDeliveryRate: onTimeRate,
    });
  }, [shipments]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "delivered":
      case "scheduled":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in_transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "delayed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "interrupted":
      case "cancelled":
      case "issue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Get icon for node type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case "supplier":
        return <Package className="h-5 w-5" />;
      case "warehouse":
        return <Warehouse className="h-5 w-5" />;
      case "distribution":
        return <Truck className="h-5 w-5" />;
      case "retail":
        return <Store className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };
  
  // Get icon for shipment status
  const getShipmentStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in_transit":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "scheduled":
        return <Clock className="h-5 w-5 text-gray-500" />;
      case "delayed":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };
  
  // Calculate shipment progress percentage
  const calculateProgress = (shipment: Shipment) => {
    if (shipment.status === "delivered") return 100;
    if (shipment.status === "scheduled") return 0;
    
    const departureDate = new Date(shipment.departureDate).getTime();
    const estimatedArrival = new Date(shipment.estimatedArrival).getTime();
    const now = new Date().getTime();
    
    // Calculate progress based on time elapsed
    const totalDuration = estimatedArrival - departureDate;
    const elapsed = now - departureDate;
    
    let progress = Math.round((elapsed / totalDuration) * 100);
    
    // Ensure progress is between 0 and 99 for in-transit shipments
    if (progress < 0) progress = 0;
    if (progress > 99 && shipment.status !== "delivered") progress = 99;
    
    return progress;
  };
  
  // Get product name by ID
  const getProductName = (productId: number) => {
    const product = inventory.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };
  
  // Get related sales for a shipment
  const getRelatedSales = (shipmentId: string) => {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment || !shipment.relatedSaleIds) return [];
    
    return sales.filter(sale => shipment.relatedSaleIds?.includes(sale.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Supply Chain Management</h2>
          <p className="text-muted-foreground">
            Monitor and manage your entire supply chain network
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Package className="mr-2 h-4 w-4" />
            Add Node
          </Button>
          <Button variant="outline" size="sm">
            <Truck className="mr-2 h-4 w-4" />
            Add Route
          </Button>
          <Button size="sm">
            <Package className="mr-2 h-4 w-4" />
            Create Shipment
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeShipments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeShipments > 0 ? `+${stats.activeShipments} from last month` : "No active shipments"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Shipments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delayedShipments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.delayedShipments > 0 
                ? `${stats.delayedShipments} shipments need attention` 
                : "All shipments on schedule"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDeliveryTime.toFixed(1)} hrs</div>
            <p className="text-xs text-muted-foreground">
              Based on {stats.completedShipments} completed shipments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onTimeDeliveryRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.onTimeDeliveryRate >= 90 
                ? "Excellent performance" 
                : stats.onTimeDeliveryRate >= 75 
                  ? "Good performance" 
                  : "Needs improvement"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="nodes">Network Nodes</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Network</CardTitle>
              <CardDescription>
                Visual overview of your entire supply chain network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Interactive network visualization would go here</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>
                  Latest shipment activity in your supply chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shipments.slice(0, 5).map((shipment) => {
                    const route = getRouteById(routes, shipment.routeId);
                    const fromNode = route ? getNodeById(nodes, route.from) : null;
                    const toNode = route ? getNodeById(nodes, route.to) : null;
                    
                    return (
                      <div key={shipment.id} className="flex items-center">
                        {getShipmentStatusIcon(shipment.status)}
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {fromNode?.name} → {toNode?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {shipment.trackingCode} • {formatDate(shipment.departureDate)}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  
                  {shipments.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">No shipments yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Network Status</CardTitle>
                <CardDescription>
                  Current status of your supply chain nodes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nodes.map((node) => (
                    <div key={node.id} className="flex items-center">
                      {getNodeIcon(node.type)}
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{node.name}</p>
                        <p className="text-sm text-muted-foreground">{node.location}</p>
                      </div>
                      <div className="ml-auto">
                        <Badge className={getStatusColor(node.status)}>
                          {node.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Shipments</CardTitle>
              <CardDescription>
                Track and manage all shipments in your supply chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking Code</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Est. Arrival</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((shipment) => {
                    const route = getRouteById(routes, shipment.routeId);
                    const fromNode = route ? getNodeById(nodes, route.from) : null;
                    const toNode = route ? getNodeById(nodes, route.to) : null;
                    const progress = calculateProgress(shipment);
                    
                    return (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.trackingCode}</TableCell>
                        <TableCell>
                          {fromNode?.name} → {toNode?.name}
                        </TableCell>
                        <TableCell>{formatDate(shipment.departureDate)}</TableCell>
                        <TableCell>{formatDate(shipment.estimatedArrival)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2 w-[60px]" />
                            <span className="text-xs">{progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedShipment(shipment)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {shipments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No shipments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nodes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Nodes</CardTitle>
              <CardDescription>
                Manage all nodes in your supply chain network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodes.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {getNodeIcon(node.type)}
                          <span className="ml-2">{node.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{node.type}</TableCell>
                      <TableCell>{node.location}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(node.status)}>
                          {node.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supply Routes</CardTitle>
              <CardDescription>
                Manage transportation routes between nodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Transport Method</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => {
                    const fromNode = getNodeById(nodes, route.from);
                    const toNode = getNodeById(nodes, route.to);
                    
                    return (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">
                          {fromNode?.name} → {toNode?.name}
                        </TableCell>
                        <TableCell className="capitalize">{route.transportMethod}</TableCell>
                        <TableCell>{route.duration} hours</TableCell>
                        <TableCell>{route.distance} km</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(route.status)}>
                            {route.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
