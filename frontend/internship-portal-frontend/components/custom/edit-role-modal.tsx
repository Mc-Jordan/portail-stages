'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { adminApi } from '@/lib/api';
import { updateUserRoleSchema, type UpdateUserRoleFormData } from '@/lib/zod-schemas';
import { UserDTO, Role } from '@/types';

interface EditRoleModalProps {
  user: UserDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roles: Role[] = ['STUDENT', 'COMPANY', 'TEACHER', 'ADMIN'];

export function EditRoleModal({ user, open, onOpenChange }: EditRoleModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateUserRoleFormData>({
    resolver: zodResolver(updateUserRoleSchema),
    defaultValues: {
      newRole: user.role,
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: UpdateUserRoleFormData) =>
      adminApi.updateUserRole(user.id, data),
    onSuccess: () => {
      toast.success('User role updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update user role';
      toast.error(message);
    },
  });

  const onSubmit = (data: UpdateUserRoleFormData) => {
    if (data.newRole === user.role) {
      toast.error('Please select a different role');
      return;
    }
    updateRoleMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
          <DialogDescription>
            Change the role for {user.firstName} {user.lastName} ({user.email})
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Current Role: </span>
                <span className="text-muted-foreground">{user.role}</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="newRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateRoleMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Role
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
