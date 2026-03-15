import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Shield,
  Users,
  MapPin,
  UserX,
  Trash2,
  RotateCcw,
  Eye,
  Send,
  X,
  Sun,
  Moon,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { UserRole } from '../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface SettingsViewProps {
  userRole: UserRole;
}

type UserStatus = 'Active' | 'Locked' | 'Pending invite' | 'Deactivated';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  mfaEnabled: boolean;
  teams: string[];
  region: string;
  lastActive: string;
  isOwner?: boolean;
  hasActiveAssignments?: boolean;
}

const sampleUsers: User[] = [
  { id: '1', name: 'Jane Doe', email: 'jane.doe@fiberfast.ph', role: 'SuperAdmin', status: 'Active', mfaEnabled: true, teams: ['Corporate Support'], region: 'NCR', lastActive: '2 min ago', isOwner: true },
  { id: '2', name: 'Maria Santos', email: 'maria.santos@fiberfast.ph', role: 'SystemAdmin', status: 'Active', mfaEnabled: true, teams: ['North Ops', 'Corporate Support'], region: 'NCR', lastActive: '1 hour ago' },
  { id: '3', name: 'Jose Cruz', email: 'jose.cruz@fiberfast.ph', role: 'CustomerSupport', status: 'Active', mfaEnabled: false, teams: ['Customer Service'], region: 'NCR', lastActive: '5 min ago' },
  { id: '4', name: 'Ana Reyes', email: 'ana.reyes@fiberfast.ph', role: 'Technician', status: 'Active', mfaEnabled: true, teams: ['North Ops'], region: 'CALABARZON', lastActive: '30 min ago', hasActiveAssignments: true },
  { id: '5', name: 'Pedro Aquino', email: 'pedro.aquino@fiberfast.ph', role: 'SuperAdmin', status: 'Locked', mfaEnabled: true, teams: ['Corporate Support'], region: 'NCR', lastActive: '2 days ago' },
  { id: '6', name: 'Carmen Lopez', email: 'carmen.lopez@fiberfast.ph', role: 'CustomerSupport', status: 'Pending invite', mfaEnabled: false, teams: ['Customer Service'], region: 'NCR', lastActive: 'Never' },
  { id: '7', name: 'Roberto Garcia', email: 'roberto.garcia@fiberfast.ph', role: 'Technician', status: 'Deactivated', mfaEnabled: false, teams: ['South Ops'], region: 'CALABARZON', lastActive: '30 days ago' },
];

const teams = ['North Ops', 'South Ops', 'Corporate Support', 'Customer Service', 'Field Tech'];
const regions = ['NCR', 'CALABARZON', 'Central Luzon', 'Visayas', 'Mindanao'];

export function SettingsView({ userRole }: SettingsViewProps) {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [selectedTab, setSelectedTab] = useState('users');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedMfa, setSelectedMfa] = useState<string>('all');
  
  // Invite form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('CustomerSupport');
  const [inviteTeams, setInviteTeams] = useState<string[]>([]);
  const [inviteRegion, setInviteRegion] = useState('');
  const [requireMfa, setRequireMfa] = useState(false);
  
  // Email preview
  const [emailLang, setEmailLang] = useState<'en' | 'fil'>('en');
  const [emailTheme, setEmailTheme] = useState<'light' | 'dark'>('light');

  const scope = userRole === 'SystemAdmin' ? ' (Tenant scope)' : '';

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!user.name.toLowerCase().includes(query) && 
          !user.email.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (selectedTeams.length > 0 && !user.teams.some(t => selectedTeams.includes(t))) return false;
    if (selectedRegions.length > 0 && !selectedRegions.includes(user.region)) return false;
    if (selectedStatus !== 'all' && user.status !== selectedStatus) return false;
    if (selectedRole !== 'all' && user.role !== selectedRole) return false;
    if (selectedMfa !== 'all') {
      if (selectedMfa === 'enabled' && !user.mfaEnabled) return false;
      if (selectedMfa === 'disabled' && user.mfaEnabled) return false;
    }
    return true;
  });

  const hasFilters = searchQuery !== '' || selectedTeams.length > 0 || 
                     selectedRegions.length > 0 || selectedStatus !== 'all' || 
                     selectedRole !== 'all' || selectedMfa !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTeams([]);
    setSelectedRegions([]);
    setSelectedStatus('all');
    setSelectedRole('all');
    setSelectedMfa('all');
  };

  const handleInviteUser = () => {
    const newUser: User = {
      id: `${users.length + 1}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: 'Pending invite',
      mfaEnabled: requireMfa,
      teams: inviteTeams,
      region: inviteRegion,
      lastActive: 'Never',
    };
    setUsers([...users, newUser]);
    setShowInviteDialog(false);
    toast.success(`Invite sent to ${inviteEmail}`);
    
    // Reset form
    setInviteName('');
    setInviteEmail('');
    setInviteRole('CustomerSupport');
    setInviteTeams([]);
    setInviteRegion('');
    setRequireMfa(false);
  };

  const handleDeactivateUser = () => {
    if (!selectedUser) return;
    setUsers(users.map(u => 
      u.id === selectedUser.id ? { ...u, status: 'Deactivated' as UserStatus } : u
    ));
    setShowDeactivateDialog(false);
    setSelectedUser(null);
    toast.success('User deactivated');
  };

  const handleReactivateUser = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id ? { ...u, status: 'Active' as UserStatus } : u
    ));
    toast.success('User reactivated');
  };

  const handleDeleteUser = () => {
    if (!selectedUser || deleteConfirmEmail !== selectedUser.email) {
      toast.error('Email confirmation does not match');
      return;
    }
    setUsers(users.filter(u => u.id !== selectedUser.id));
    setShowDeleteDialog(false);
    setSelectedUser(null);
    setDeleteConfirmEmail('');
    toast.success('User deleted permanently');
  };

  const canDeleteUser = (user: User) => {
    return !user.isOwner && !user.hasActiveAssignments;
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-success-100 text-success-700 border-success-200';
      case 'Locked':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'Pending invite':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'Deactivated':
        return 'bg-neutral-100 text-neutral-600 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  const toggleTeamFilter = (team: string) => {
    setSelectedTeams(prev => 
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    );
  };

  const toggleRegionFilter = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const emailContent = {
    en: {
      subject: `You're invited to FiberFast ISP — Create your account`,
      greeting: `Hi ${inviteName || '{FullName}'},`,
      body1: `Jane Doe invited you to the FiberFast ISP portal.`,
      body2: `Your role: ${inviteRole}. MFA will be required on first login.`,
      button: 'Accept invite',
      helper: 'This link expires in 48 hours.',
      footer: 'support@fiberfast.ph • Manila, Philippines • DPA • Privacy Policy',
    },
    fil: {
      subject: `Inimbitahan ka sa FiberFast ISP — Gumawa ng iyong account`,
      greeting: `Kumusta ${inviteName || '{FullName}'},`,
      body1: `Inimbitahan ka ni Jane Doe sa FiberFast ISP portal.`,
      body2: `Ang iyong role: ${inviteRole}. Kakailanganin ang MFA sa unang pag-login.`,
      button: 'Tanggapin ang imbita',
      helper: 'Ang link na ito ay mag-expire sa loob ng 48 oras.',
      footer: 'support@fiberfast.ph • Manila, Pilipinas • DPA • Privacy Policy',
    },
  };

  const content = emailContent[emailLang];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Settings</h2>
        <p className="text-muted-foreground">System configuration and preferences{scope}</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users & Permissions
          </TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4 mt-6">
          {/* Toolbar */}
          <Card className="p-4">
            <div className="space-y-4">
              {/* Search and Actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={() => setShowInviteDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Team Filter */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Team:</span>
                  <div className="flex gap-1 flex-wrap">
                    {teams.slice(0, 3).map((team) => (
                      <Badge
                        key={team}
                        variant={selectedTeams.includes(team) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleTeamFilter(team)}
                      >
                        {team}
                        {selectedTeams.includes(team) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Region Filter */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Region:</span>
                  <div className="flex gap-1 flex-wrap">
                    {regions.slice(0, 3).map((region) => (
                      <Badge
                        key={region}
                        variant={selectedRegions.includes(region) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleRegionFilter(region)}
                      >
                        {region}
                        {selectedRegions.includes(region) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Locked">Locked</SelectItem>
                    <SelectItem value="Pending invite">Pending invite</SelectItem>
                    <SelectItem value="Deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>

                {/* Role Filter */}
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                    <SelectItem value="SystemAdmin">SystemAdmin</SelectItem>
                    <SelectItem value="CustomerSupport">Support</SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                  </SelectContent>
                </Select>

                {/* MFA Filter */}
                <Select value={selectedMfa} onValueChange={setSelectedMfa}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="MFA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All MFA</SelectItem>
                    <SelectItem value="enabled">MFA Enabled</SelectItem>
                    <SelectItem value="disabled">MFA Disabled</SelectItem>
                  </SelectContent>
                </Select>

                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                )}

                <div className="ml-auto text-sm text-muted-foreground">
                  {filteredUsers.length} users
                </div>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>MFA</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id}
                    className={user.status === 'Deactivated' ? 'opacity-50' : ''}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full ${user.status === 'Deactivated' ? 'bg-neutral-200' : 'bg-primary'} text-primary-foreground flex items-center justify-center`}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p>{user.name}</p>
                          {user.isOwner && (
                            <Badge variant="outline" className="text-xs mt-0.5">Owner</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)} variant="outline">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {user.teams.slice(0, 2).map((team) => (
                          <Badge key={team} variant="secondary" className="text-xs">
                            {team}
                          </Badge>
                        ))}
                        {user.teams.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{user.teams.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.region}</TableCell>
                    <TableCell>
                      {user.mfaEnabled ? (
                        <CheckCircle2 className="h-4 w-4 text-success-500" />
                      ) : (
                        <X className="h-4 w-4 text-error-500" />
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastActive}
                    </TableCell>
                    <TableCell>
                      {user.status === 'Deactivated' ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReactivateUser(user)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Reactivate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (canDeleteUser(user)) {
                                setSelectedUser(user);
                                setShowDeleteDialog(true);
                              } else {
                                toast.error('Cannot delete: owner or has active assignments');
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit user</DropdownMenuItem>
                            <DropdownMenuItem>Reset password</DropdownMenuItem>
                            <DropdownMenuItem>Manage permissions</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeactivateDialog(true);
                              }}
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                if (canDeleteUser(user)) {
                                  setSelectedUser(user);
                                  setShowDeleteDialog(true);
                                } else {
                                  toast.error('Cannot delete: owner or has active assignments');
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {hasFilters 
                    ? 'No users match your filters.'
                    : 'No users in selected team/region.'}
                </p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">General Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company Name</span>
                  <span>FiberFast ISP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone</span>
                  <span>Asia/Manila (GMT+8)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency</span>
                  <span>PHP (₱)</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Regional Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language</span>
                  <span>English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Format</span>
                  <span>MM/DD/YYYY</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Format</span>
                  <span>12-hour</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="mb-4">Notification Preferences</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Notifications</span>
                <span className="text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SMS Alerts</span>
                <span className="text-green-600">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slack Integration</span>
                <span className="text-muted-foreground">Disabled</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                  <SelectItem value="SystemAdmin">SystemAdmin</SelectItem>
                  <SelectItem value="CustomerSupport">Support</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teams">Teams</Label>
                <Select
                  value={inviteTeams[0]}
                  onValueChange={(v) => setInviteTeams([v])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select value={inviteRegion} onValueChange={setInviteRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region..." />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="mfa">Require MFA on first login</Label>
                <p className="text-sm text-muted-foreground">
                  User must set up multi-factor authentication
                </p>
              </div>
              <Switch
                id="mfa"
                checked={requireMfa}
                onCheckedChange={setRequireMfa}
              />
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmailPreview(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview email
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteUser}>
                <Mail className="h-4 w-4 mr-2" />
                Send invite
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Preview Overlay */}
      <Dialog open={showEmailPreview} onOpenChange={setShowEmailPreview}>
        <DialogContent className="max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Preview invite email</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Select value={emailLang} onValueChange={(v) => setEmailLang(v as 'en' | 'fil')}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fil">Filipino</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmailTheme(emailTheme === 'light' ? 'dark' : 'light')}
              >
                {emailTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success('Test invite sent to jane.doe@fiberfast.ph')}
              >
                <Send className="h-4 w-4 mr-2" />
                Send test to me
              </Button>
            </div>
          </DialogHeader>
          
          <ScrollArea className="max-h-[500px]">
            <div
              className={`p-6 rounded-lg border ${
                emailTheme === 'light'
                  ? 'bg-white border-neutral-200'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-100'
              }`}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Subject:</p>
                  <p className="font-medium">{content.subject}</p>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <p>{content.greeting}</p>
                  <p>{content.body1}</p>
                  {requireMfa && <p>{content.body2}</p>}
                  
                  <div className="py-4">
                    <Button className="w-full">
                      {content.button}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    {content.helper}
                  </p>
                </div>
                
                <Separator />
                
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {content.footer}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button onClick={() => setShowEmailPreview(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate User Dialog */}
      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate user?</AlertDialogTitle>
            <AlertDialogDescription>
              User will lose access but history, tickets, and audit records remain.
              You can reactivate this user later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivateUser}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Permanently delete user?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This cannot be undone. Historical references remain anonymized.
              </p>
              {selectedUser && !canDeleteUser(selectedUser) && (
                <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <p className="text-sm text-warning-700">
                    Cannot delete: User is a tenant owner or has active assignments.
                    Deactivate instead to retain history.
                  </p>
                </div>
              )}
              {selectedUser && canDeleteUser(selectedUser) && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-email">
                    Type <strong>{selectedUser.email}</strong> to confirm
                  </Label>
                  <Input
                    id="confirm-email"
                    placeholder="Enter email to confirm"
                    value={deleteConfirmEmail}
                    onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                  />
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmEmail('')}>
              Cancel
            </AlertDialogCancel>
            {selectedUser && canDeleteUser(selectedUser) && (
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteConfirmEmail !== selectedUser.email}
              >
                Delete user
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
