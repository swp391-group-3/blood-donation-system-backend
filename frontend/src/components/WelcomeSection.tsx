import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WelcomeSection() {
    return (
        <Card className="p-6">
            <CardContent className="flex justify-between items-center p-0">
                <div>
                    <div className="text-2xl font-bold mb-1">
                        Welcome back, Nam Dang!
                    </div>
                    <div className="text-muted-foreground">
                        Here's your donation dashboard
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex flex-col items-center  gap-1">
                        <Badge
                            variant="outline"
                            className="bg-red-50 text-zinc-950 border-red-600 rounded-full px-3"
                        >
                            O+
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            Blood Type
                        </span>
                    </div>

                    <div className="flex flex-col items-center  gap-1">
                        <Badge
                            variant="outline"
                            className="bg-blue-100 text-zinc-950 border-blue-600 rounded-full px-3"
                        >
                            3
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            Donations
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
