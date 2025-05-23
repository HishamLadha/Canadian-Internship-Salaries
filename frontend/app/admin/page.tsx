'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner"

interface PendingSalary {
  id: number;
  company: string;
  salary: number;
  role: string;
  location: string;
  year: number;
  university: string;
  bonus?: number;
  term?: number;
  arrangement?: string;
  status: string;
  ip_address: string;
  submitted_at: string;
}

export default function AdminPage() {
  const [pendingSalaries, setPendingSalaries] = useState<PendingSalary[]>([]);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchPendingSalaries = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/pending-submissions`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingSalaries(data);
        setIsLoggedIn(true);
      } else {
        if (response.status === 429) {
          toast.error("Too many attempts. Please try again later.");
        } else {
          toast.error("Invalid credentials");
        }
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    }
  };

  const handleApprove = async (id: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/approve/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
      }
    });
    if (response.ok) {
      fetchPendingSalaries();
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/reject/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
        }
      });
      if (response.ok) {
        toast.success("Submission rejected");
        fetchPendingSalaries();
      } else {
        toast.error("Failed to reject submission");
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard :)</h1>
        
        {/* Login Form */}
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-2 border rounded"
            />
            <Button 
              onClick={fetchPendingSalaries}
              className="w-full"
            >
              {isLoggedIn ? 'Refresh Submissions' : 'Login'}
            </Button>
          </div>
        </div>
      </div>

      {/* Pending Submissions Table - Only shown when logged in */}
      {isLoggedIn && (
        <div className="container mx-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Arrangement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingSalaries.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell>{salary.company}</TableCell>
                  <TableCell>${salary.salary}/hr</TableCell>
                  <TableCell>{salary.role}</TableCell>
                  <TableCell>{salary.university}</TableCell>
                  <TableCell>{salary.location || 'N/A'}</TableCell>
                  <TableCell>{salary.year}</TableCell>
                  <TableCell>{salary.bonus ? `$${salary.bonus}` : 'N/A'}</TableCell>
                  <TableCell>{salary.term || 'N/A'}</TableCell>
                  <TableCell>{salary.arrangement || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      salary.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      salary.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {salary.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{salary.ip_address}</TableCell>
                  <TableCell>{new Date(salary.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApprove(salary.id)}
                        variant="default"
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleReject(salary.id)}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}