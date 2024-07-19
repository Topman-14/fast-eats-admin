'use client'

import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import * as z from "zod";
import { Color } from "@prisma/client"
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel,
    FormMessage
 } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { LoadingButton } from "@/components/ui/loader-button";
import { ColorPicker } from "@/components/ui/color-picker";
 
const formSchema = z.object({
    name: z.string().min(1, 'required'),
    value: z.string().min(1, 'required'),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
    initialData: Color | null;
}

const ColorForm: React.FC<ColorFormProps> = ({initialData}) => {

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const title = initialData ? 'Edit Color' : 'Create Color'
    const description = initialData ? 'Edit a Color' : 'Add a new Color to use throught your store'
    const toastMessage = initialData ? 'Color updated' : 'Color created'
    const action = initialData ? 'Save Changes' : 'Create'

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        },
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true)
            if(initialData){
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/colors`, data)
            }
            router.push(`/${params.storeId}/colors`)
            router.refresh();
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Something went wrong!')
            console.error(error)
        } finally{
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.push(`/${params.storeId}/colors`)
            router.refresh()
            toast.success('Color deleted!')
        } catch (error) {
            toast.error('Make sure you removed all products using this color first!')
            console.error(error)
        } finally{
            setLoading(false)
            setOpen(false)
        }
    }

  return (
    <>
        <AlertModal 
            isOpen={open}
            onClose={()=> setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
        />
        <div className="flex items-center justify-between">
        <Heading
            title={title}
            description={description}
        />
       {initialData && (<Button 
            disabled={loading}
            variant={"destructive"}
            size={'icon'}
            onClick={()=> setOpen(true)}
        >
         <Trash className="size-4"/>
        </Button>)}
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <FormField 
                    control={form.control} 
                    name="name"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input disabled={loading} placeholder="Enter color name Label" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}
                 />
                <FormField 
                    control={form.control} 
                    name="value"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-x-4">
                                <Input disabled={loading} placeholder="red, hsl, hexcode" {...field}/>
                                {/* <div 
                                    className="border p-4 rounded-full"
                                    style={{backgroundColor: field.value}}
                                /> */}
                               <ColorPicker
                                    onChange={(v) => {
                                        field.onChange(v); 
                                    }}
                                    value={field.value}
/>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}
                 />
              </div>
              <LoadingButton 
                loading={loading}
                className="font-semibold ml-auto"
                type="submit"
                disabled={loading}
                >
                {action}
              </LoadingButton>
            </form>
        </Form>
        <Separator />
    </>
  )
}

export default ColorForm