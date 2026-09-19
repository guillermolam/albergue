import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

export interface ContactMessageRow {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string | null;
  createdAt: string | null;
}

export interface ContactMessagesTableProps {
  initialMessages: ContactMessageRow[];
}

function getStatusColor(status: string | null) {
  switch (status) {
    case 'new':
      return 'bg-yellow-100 text-[#EAC102] border-yellow-200';
    case 'read':
      return 'bg-blue-100 text-[#0071BC] border-blue-200';
    case 'archived':
      return 'bg-gray-100 text-gray-500 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-500 border-gray-200';
  }
}

export function ContactMessagesTable({ initialMessages }: ContactMessagesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Messages ({initialMessages.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">From</th>
                <th className="text-left py-3 px-4">Subject</th>
                <th className="text-left py-3 px-4">Message</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {initialMessages.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={`border-b align-top transition-colors hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <p>{entry.name}</p>
                      <p className="text-xs text-gray-500">{entry.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{entry.subject ?? '—'}</td>
                  <td className="py-3 px-4 max-w-md text-sm text-gray-700">{entry.message}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(entry.status)}>{entry.status ?? 'new'}</Badge>
                  </td>
                </tr>
              ))}
              {initialMessages.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 px-4 text-center text-sm text-gray-500">
                    No contact messages yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
