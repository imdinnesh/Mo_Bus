'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';

export default function Header() {

    const router=useRouter();

    const mutation = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout
    });

    const handleLogout = () => {
        mutation.mutate(undefined, {
            onSuccess: (data: any) => {
                useAuthStore.getState().clearAccessToken();
                router.push('/login');
                toast.success(data.message || 'Logout successful!');
            },
            onError: (err: any) => {
                toast.error(err.response?.data?.error || 'Logout failed. Please try again.');
            }
        });
    }
return (
    <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="font-bold text-lg">Mo Bus</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Logout</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to log out?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleLogout}>
                            Confirm Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </header>
);
}