import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";

const Landing = () => {
    return (
        <div className="min-h-dvh">
            <Navbar />

            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="rounded-3xl border border-border/60 bg-background/60 p-8 backdrop-blur-xl">
                    <h1 className="text-3xl font-semibold tracking-tight">Landing</h1>
                    <p className="mt-2 text-muted-foreground">
                        Plan ahead with scattered money — even with different salaries and paydays.
                    </p>

                    <div className="mt-6">
                        <Button className="rounded-2xl">Click Me</Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Landing;