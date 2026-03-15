import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Shield, CheckCircle2, AlertTriangle, Download, Database } from 'lucide-react';
import { auditEvents } from '../lib/sample-data';
import { UserRole } from '../types';

interface ComplianceViewProps {
  userRole: UserRole;
}

const complianceChecklist = [
  { item: 'Data encryption at rest', status: 'Completed', progress: 100 },
  { item: 'Data encryption in transit', status: 'Completed', progress: 100 },
  { item: 'Customer consent records', status: 'Completed', progress: 100 },
  { item: 'Data retention policy', status: 'In Progress', progress: 85 },
  { item: 'Privacy policy updates', status: 'Pending', progress: 60 },
  { item: 'Employee training', status: 'Completed', progress: 100 },
];

const ntcReports = [
  { period: 'Q3 2025', dueDate: 'Oct 31, 2025', status: 'In Progress', records: 127420 },
  { period: 'Q2 2025', dueDate: 'Jul 31, 2025', status: 'Submitted', records: 124380 },
  { period: 'Q1 2025', dueDate: 'Apr 30, 2025', status: 'Submitted', records: 119850 },
  { period: 'Q4 2024', dueDate: 'Jan 31, 2025', status: 'Archived', records: 115200 },
];

const backupHistory = [
  { type: 'Full backup', time: '3 hours ago', size: '2.4 TB', status: 'Success' },
  { type: 'Incremental', time: '1 day ago', size: '340 GB', status: 'Success' },
  { type: 'Full backup', time: '4 days ago', size: '2.3 TB', status: 'Success' },
  { type: 'Incremental', time: '5 days ago', size: '298 GB', status: 'Success' },
];

export function ComplianceView({ userRole }: ComplianceViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Compliance & Audit</h2>
          <p className="text-muted-foreground">
            Track RA 10173 compliance, NTC reporting, and security audit logs
          </p>
        </div>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Open compliance center
        </Button>
      </div>

      {/* Compliance Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-muted-foreground">RA 10173 Status</p>
          </div>
          <p className="text-green-800">On Track</p>
          <p className="text-sm text-green-600">90% compliance score</p>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <p className="text-muted-foreground">NTC Retention</p>
          </div>
          <p className="text-blue-800">OK</p>
          <p className="text-sm text-blue-600">127.4k records retained</p>
        </Card>

        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="text-muted-foreground">Audit Events</p>
          </div>
          <p className="text-amber-800">3 alerts</p>
          <p className="text-sm text-amber-600">Requires review</p>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-green-600" />
            <p className="text-muted-foreground">Last Backup</p>
          </div>
          <p className="text-green-800">3 hrs ago</p>
          <p className="text-sm text-green-600">Full backup: 2.4 TB</p>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="ra10173">
        <TabsList>
          <TabsTrigger value="ra10173">RA 10173 (Data Privacy)</TabsTrigger>
          <TabsTrigger value="ntc">NTC Reporting</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="ra10173" className="space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">RA 10173 Data Privacy Compliance Checklist</h3>
            <div className="space-y-4">
              {complianceChecklist.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.status === 'Completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : item.status === 'In Progress' ? (
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span>{item.item}</span>
                    </div>
                    <Badge
                      variant={
                        item.status === 'Completed'
                          ? 'default'
                          : item.status === 'In Progress'
                          ? 'secondary'
                          : 'outline'
                      }
                      className={
                        item.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800'
                          : ''
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900 mb-1">Compliance Score: 90%</p>
              <p className="text-blue-700 text-sm">
                Complete remaining 2 items to achieve 100% compliance with RA 10173 (Data Privacy Act of 2012)
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ntc" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>NTC Reporting Schedule & Retention</h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Generate report
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ntcReports.map((report, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{report.period}</TableCell>
                    <TableCell>{report.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.status === 'Submitted' || report.status === 'Archived'
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          report.status === 'Submitted' || report.status === 'Archived'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.records.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">
                All retention requirements met. Customer data retained for 5 years as per NTC regulations.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Security Audit Events</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {auditEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-accent/30 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>{event.event}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">{event.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">User: {event.user}</p>
                  <p className="text-sm">{event.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-amber-900 mb-1">3 events require review</p>
                  <p className="text-amber-700 text-sm">
                    Login lockout events and privilege changes should be verified by system administrators.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Backup & Recovery Status</h3>
              <Button>
                <Database className="h-4 w-4 mr-2" />
                Run backup now
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-muted-foreground mb-1">Last Full Backup</p>
                <p className="text-green-800">3 hours ago</p>
                <p className="text-sm text-green-600">2.4 TB</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-muted-foreground mb-1">Backup Frequency</p>
                <p className="text-blue-800">Daily incremental</p>
                <p className="text-sm text-blue-600">Weekly full</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-muted-foreground mb-1">Retention Period</p>
                <p className="text-purple-800">90 days</p>
                <p className="text-sm text-purple-600">3 generations</p>
              </div>
            </div>

            <h4 className="mb-3">Backup History</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backupHistory.map((backup, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{backup.type}</TableCell>
                    <TableCell>{backup.time}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {backup.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">
                All backup jobs completed successfully. Last recovery test: Oct 10, 2025 (RTO: 4h, RPO: 1h)
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
