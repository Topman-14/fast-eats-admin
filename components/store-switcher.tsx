"use client"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useStoreModal } from '@/hooks/use-store-modal';
import { Store } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, CircleCheck, Store as StoreIcon } from 'lucide-react'
import { cn } from '@/lib/utils';
import { useDevMode } from '@/hooks/use-dev-mode';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
}
export default function StoreSwitcher({
    className,
    items = []
}: StoreSwitcherProps){
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();
    const {setDev} = useDevMode();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
        isDeveloper: item.isDeveloper
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId)

    useEffect(() => {
        setDev(currentStore?.isDeveloper || false)
    }, [])


    const [open, setOpen] = useState(false)

    const onStoreSelect = (store: {value: string, label: string }) =>{
        setOpen(false)
        router.push(`/${store.value}`)
    }

    return(
        <div
            className={cn(' h-10 justify-between flex gap-2 items-center rounded-lg border-muted border px-3 py-1', className)}
        >
            <StoreIcon className='mr-2 h-4 w-4'/>
                {currentStore?.label}
        </div>
)
}