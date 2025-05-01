import { useContext, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Truck, 
  RefreshCw, 
  ArrowUpDown, 
  MoreHorizontal, 
  Phone, 
  Mail 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageContext } from '@/lib/language-context';

const suppliers = [
  { 
    id: 1, 
    name: 'Ceylon Grain Suppliers', 
    contact: 'Nuwan Perera', 
    phone: '+94 77 123 4567', 
    email: 'nuwan@ceylongrain.lk', 
    status: 'active',
    productsSupplied: 15,
    lastOrder: '3 days ago'
  },
  { 
    id: 2, 
    name: 'Dairy Fresh Ltd', 
    contact: 'Kamala Silva', 
    phone: '+94 76 234 5678', 
    email: 'kamala@dairyfresh.lk', 
    status: 'active',
    productsSupplied: 8,
    lastOrder: '1 week ago'
  },
  { 
    id: 3, 
    name: 'Kandy Wholesale Traders', 
    contact: 'Roshan Bandara', 
    phone: '+94 71 345 6789', 
    email: 'roshan@kwt.lk', 
    status: 'inactive',
    productsSupplied: 25,
    lastOrder: '1 month ago'
  },
  { 
    id: 4, 
    name: 'Colombo Grocery Distributors', 
    contact: 'Anita Fernando', 
    phone: '+94 77 456 7890', 
    email: 'anita@cgd.lk', 
    status: 'active',
    productsSupplied: 32,
    lastOrder: '2 days ago'
  },
  { 
    id: 5, 
    name: 'Island Spice Exporters', 
    contact: 'Ravi Mendis', 
    phone: '+94 76 567 8901', 
    email: 'ravi@islandspice.lk', 
    status: 'active',
    productsSupplied: 10,
    lastOrder: '5 days ago'
  },
];

export function Suppliers() {
  const { translations } = useContext(LanguageContext);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">{translations.suppliers}</h1>
        <div className="mt-4 sm:mt-0">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {translations.addSupplier}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>{translations.supplierDirectory}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center rounded-md border px-3 h-9 text-sm w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input 
                  className="border-0 p-0 shadow-none focus-visible:ring-0 h-8"
                  placeholder={translations.searchSuppliers}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline" size="icon" className="h-9 w-9">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">
                  <div className="flex items-center">
                    {translations.supplier}
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>{translations.contactPerson}</TableHead>
                <TableHead>{translations.contactInfo}</TableHead>
                <TableHead className="text-center">{translations.status}</TableHead>
                <TableHead>{translations.products}</TableHead>
                <TableHead>{translations.lastOrder}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {translations.noSuppliersFound}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span className="text-sm">{supplier.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span className="text-sm">{supplier.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={supplier.status === 'active' ? 'outline' : 'secondary'}>
                        {supplier.status === 'active' ? translations.active : translations.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell>{supplier.productsSupplied}</TableCell>
                    <TableCell>{supplier.lastOrder}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{translations.actions}</DropdownMenuLabel>
                          <DropdownMenuItem>{translations.viewDetails}</DropdownMenuItem>
                          <DropdownMenuItem>{translations.editSupplier}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>{translations.createOrder}</DropdownMenuItem>
                          <DropdownMenuItem>{translations.viewOrderHistory}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            {translations.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}