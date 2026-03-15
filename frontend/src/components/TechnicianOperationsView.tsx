import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { MapPin, Calendar, Clock, CheckCircle2, Users, TrendingUp } from 'lucide-react';
import { technicianJobs } from '../lib/sample-data';
import { UserRole } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TechnicianOperationsViewProps {
  userRole: UserRole;
}

const technicianPerformance = [
  { name: 'JL', jobs: 42, onTime: 39, score: 92 },
  { name: 'RD', jobs: 38, onTime: 36, score: 95 },
  { name: 'TM', jobs: 35, onTime: 32, score: 91 },
  { name: 'KC', jobs: 31, onTime: 29, score: 94 },
  { name: 'AP', jobs: 28, onTime: 26, score: 93 },
];

const scheduleData = [
  { time: '8:00 AM', mon: 5, tue: 6, wed: 4, thu: 7, fri: 5 },
  { time: '10:00 AM', mon: 8, tue: 7, wed: 9, thu: 8, fri: 7 },
  { time: '12:00 PM', mon: 6, tue: 5, wed: 6, thu: 5, fri: 6 },
  { time: '2:00 PM', mon: 9, tue: 8, wed: 7, thu: 9, fri: 8 },
  { time: '4:00 PM', mon: 7, tue: 6, wed: 8, thu: 7, fri: 6 },
];

export function TechnicianOperationsView({ userRole }: TechnicianOperationsViewProps) {
  const isReadOnly = userRole === 'CustomerSupport';
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Technician Operations</h2>
          <p className="text-muted-foreground">
            Schedule field technicians, track jobs, and monitor SLA performance
          </p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule technician
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <p className="text-muted-foreground">On Duty</p>
          </div>
          <p className="text-foreground">58/72</p>
          <p className="text-sm text-muted-foreground">80.6% utilization</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-muted-foreground">On-time SLA</p>
          </div>
          <p className="text-green-600">92%</p>
          <p className="text-sm text-green-600">+3% vs last week</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <p className="text-muted-foreground">Avg Travel</p>
          </div>
          <p className="text-foreground">28 min</p>
          <p className="text-sm text-green-600">-5 min vs last week</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <p className="text-muted-foreground">First-time Fix</p>
          </div>
          <p className="text-foreground">87%</p>
          <p className="text-sm text-green-600">+2% vs last month</p>
        </Card>

        <Card className="p-4">
          <p className="text-muted-foreground">Jobs Today</p>
          <p className="text-foreground">174</p>
          <p className="text-sm text-muted-foreground">82 completed</p>
        </Card>
      </div>

      {/* Map View */}
      <Card className="p-6">
        <h3 className="mb-4">Live Technician Map</h3>
        <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center border border-border">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Interactive map showing technician locations</p>
            <p className="text-sm text-muted-foreground mt-1">
              58 active technicians across Metro Manila
            </p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm">Available (23)</span>
            </div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-sm">En route (18)</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-sm">On site (17)</span>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-400" />
              <span className="text-sm">Off duty (14)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Job Schedule & Performance */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">This Week's Schedule (Jobs per Time Slot)</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scheduleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="mon" fill="hsl(var(--chart-1))" />
                <Bar dataKey="tue" fill="hsl(var(--chart-2))" />
                <Bar dataKey="wed" fill="hsl(var(--chart-3))" />
                <Bar dataKey="thu" fill="hsl(var(--chart-4))" />
                <Bar dataKey="fri" fill="hsl(var(--chart-5))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Top Performers (This Month)</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tech</TableHead>
                <TableHead>Jobs</TableHead>
                <TableHead>On-time</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicianPerformance.map((tech) => (
                <TableRow key={tech.name}>
                  <TableCell>
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {tech.name}
                    </div>
                  </TableCell>
                  <TableCell>{tech.jobs}</TableCell>
                  <TableCell>{tech.onTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{tech.score}%</span>
                      {tech.score >= 93 && <TrendingUp className="h-4 w-4 text-green-600" />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 text-sm">
              Average team performance: 93% (above 90% target)
            </p>
          </div>
        </Card>
      </div>

      {/* Today's Job Queue */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Today's Job Queue</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Filter by area</Button>
            <Button variant="outline" size="sm">Auto-assign</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {technicianJobs.map((job, idx) => (
              <TableRow key={idx}>
                <TableCell>{job.time}</TableCell>
                <TableCell>{job.customer}</TableCell>
                <TableCell>{job.area}</TableCell>
                <TableCell>Installation</TableCell>
                <TableCell>
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    {job.tech}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Scheduled
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Handoff Note */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-blue-900 mb-1">Mobile Companion App</p>
            <p className="text-blue-700 text-sm">
              Technicians use the mobile app (360×800 optimized) for job acceptance, GPS tracking, and status updates.
              All status changes are immutably geo-tagged and timestamped for SLA verification.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
