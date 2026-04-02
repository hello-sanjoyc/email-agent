import MainLayout from "../layouts/MainLayout";
import Introduction from "../components/home/Introduction";
import Workflow from "../components/home/Workflow";
import Enquiry from "../components/home/Enquiry";

export default function HomePage() {
  return (
    <MainLayout showFooter>
      <Introduction />
      <Workflow />
      <Enquiry />
    </MainLayout>
  );
}