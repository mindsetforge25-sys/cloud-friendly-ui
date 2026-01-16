import { Header } from '@/components/Header';
import { CreateDeliveryForm } from '@/components/CreateDeliveryForm';

const CreateDelivery = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 sm:py-12 lg:py-16 px-4">
        <CreateDeliveryForm />
      </main>
    </div>
  );
};

export default CreateDelivery;
