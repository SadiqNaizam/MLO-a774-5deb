import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  children?: React.ReactNode; // Filters will be passed as children
  title?: string;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, title = "Filters", className }) => {
  console.log("Rendering Sidebar with title:", title);
  return (
    <aside className={cn("w-full md:w-72 lg:w-80 space-y-6 p-4 border-r h-full", className)}> {/* Full height for scroll */}
       <h2 className="text-xl font-semibold text-foreground">{title}</h2>
       <Separator />
       <ScrollArea className="h-[calc(100vh-12rem)] pr-3"> {/* Adjust height based on header/footer */}
            <div className="space-y-6">
                {children ? children : (
                    <>
                        {/* Placeholder Content - Replace with actual filter components */}
                        <div className="text-muted-foreground">Filter Group 1 Placeholder</div>
                        <Separator />
                        <div className="text-muted-foreground">Filter Group 2 Placeholder</div>
                        <Separator />
                        <div className="text-muted-foreground">Filter Group 3 Placeholder</div>
                    </>
                )}
            </div>
       </ScrollArea>
    </aside>
  );
};
export default Sidebar;