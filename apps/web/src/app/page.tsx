import { Header } from '@/components/header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold tracking-tight">
              Monitore seus sites com{' '}
              <span className="text-primary">simplicidade</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Sistema de monitoramento de uptime brasileiro com preço justo em real
            </p>
          </div>
        </div>
      </main>
    </>
  );
}