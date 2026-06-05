import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../components/Loader';

const LazyLoad = () => {

  // ? Login pages
  const Login = lazy(() => import(`../pages/auth/Login.jsx`));

  // ? Register Page
  const Register = lazy(() => import(`../pages/auth/Register.jsx`));

  const Dashboard = lazy(() => import(`../pages/Dashboard`));
  const Otp = lazy(() => import(`../pages/Otp`));

  const ProjectEdit = lazy(() => import(`../pages/projectEdit/EditProject.jsx`));

  const BookaStall = lazy(() => import(`../pages/BookaStall`));
  const CompletedExpo = lazy(() => import(`../pages/CompletedExpo`));
  const FutureExpo = lazy(() => import(`../pages/FutureExpo`));
  const OngoingExpo = lazy(() => import(`../pages/OngoingExpo`));
  const PendingExpo = lazy(() => import(`../pages/PendingExpo`));
  const AddExecutive = lazy(() => import(`../pages/AddExecutive`));
  const AddExecutivePone = lazy(() => import(`../pages/AddExecutivePone`));
  const ViewDetails = lazy(() => import(`../pages/ViewDetails`));
  const FeatureDetails = lazy(() => import(`../pages/FeatureDetails`));
  const StallManagement = lazy(() => import(`../pages/StallManagement`));
  const NoofExecutive = lazy(() => import(`../pages/Lists/NoofExecutive`));
  const Ebroucher = lazy(() => import(`../pages/Lists/Ebroucher`));
  const DropMessage = lazy(() => import(`../pages/Lists/DropMessage`));
  const EnquiryList = lazy(() => import(`../pages/Lists/EnquiryList`));
  const WhatsappCall = lazy(() => import(`../pages/Lists/WhatsappCall`));
  const ExecutiveLogin = lazy(() => import(`../pages/ExecutiveLogin`));
  const Executivedashboard = lazy(() => import(`../pages/Executivedashboard`));
  const AllexpoListings = lazy(() => import(`../pages/AllexpoListings`));
  const Features = lazy(() => import(`../pages/Features`));
  const AddProperties = lazy(() => import(`../pages/properties/AddProperties`))

  // -------------------//

  const Profile = lazy(() => import(`../pages/Profile`));
  const BuilderDashboard = lazy(() => import(`../pages/BuilderDashboard`));


  //-------------------- premium -listings----------//


  const BuysalePakage = lazy(() => import(`../pages/PremiumListings/BuysalePakage`));
  const Activesalepakage = lazy(() => import(`../pages/PremiumListings/Activesalepakage`));
  const Postnewproject = lazy(() => import(`../pages/PremiumListings/Postnewproject`));
  const Buyrentpackages = lazy(() => import(`../pages/PremiumListings/Buyrentpackages`));
  const Activerentpackage = lazy(() => import(`../pages/PremiumListings/Activerentpackage`));
  const Postnewrentals = lazy(() => import(`../pages/PremiumListings/Postnewrentals`));

  const PackageResponsive = lazy(() => import(`../pages/PremiumListings/PackageResponsive`));



  //-------------------- meta -listings----------//

  const Activepakage = lazy(() => import(`../pages/MetaverseListings/Activepakage`));
  const BuyPakage = lazy(() => import(`../pages/MetaverseListings/BuyPakage`));
  const Postproject = lazy(() => import(`../pages/MetaverseListings/Postproject`));

  const AddMetaListing = lazy(() => import(`../pages/MetaverseListings/AddListings`))
  //---------------------

  const ProjectName = lazy(() => import(`../pages/projects/ProjectName`));
  const MasterProjects = lazy(() => import(`../pages/projects/MasterProjects`));
  const AddProjectName = lazy(() => import(`../pages/projects/AddProjectName`));
  const AddProjects = lazy(() => import(`../pages/projects/AddProjects`));
  const ProjectsList = lazy(() => import(`../pages/projects/Projects`));
  const ActiveProjects = lazy(() => import(`../pages/projects/ActiveProjects`));
  const InActiveProjects = lazy(() => import(`../pages/projects/InActiveProjects`));
  const AddListings = lazy(() => import(`../pages/projects/AddListings`));



  const ModelDashboard = lazy(() => import(`../pages/ModelHouse/ModelDashboard`));
  const AssignExeone = lazy(() => import(`../pages/ModelHouse/AssignExeone`));
  const AssignExetwo = lazy(() => import(`../pages/ModelHouse/AssignExetwo`));
 
 
  const MasterProjectsname = lazy(() => import(`../pages/MasterProjectslists/MasterProjectsname`));
  const MasterProjectslist = lazy(() => import(`../pages/MasterProjectslists/MasterProjectslist`));
  const MasteractiveProjects = lazy(() => import(`../pages/MasterProjectslists/MasteractiveProjects`));
  const MasterinactiveProjects = lazy(() => import(`../pages/MasterProjectslists/MasterinactiveProjects`));
  const MasterrejectedProjects = lazy(() => import(`../pages/MasterProjectslists/MasterrejectedProjects`));



  return (
    <Suspense fallback={<Loader />}>
      <Routes>

        <Route path="/" element={<Register />} />

        {/* //  Login Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="Otp" element={<Otp />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<BuilderDashboard />} />

        {/* Packages Routes */}

        <Route path="/packages/sale" element={<BuysalePakage />} />
        <Route path="/packages/sale-active" element={<Activesalepakage />} />
        <Route path="/projects/add" element={<ProjectsList />} />

        <Route path="/packages/rental" element={<Buyrentpackages />} />
        <Route path="/packages/rental-active" element={<Activerentpackage />} />
        <Route path="/post/rentals" element={<Postnewrentals />} />

        <Route path="/package/responses/:id" element={<PackageResponsive />} />

        {/* // expo Routes  */}
        <Route path="/airpropx/dashboard" element={<Dashboard />} />

        <Route path="/expo/pending" element={<PendingExpo />} />
        <Route path="/expo/future" element={<FutureExpo />} />
        <Route path="/expo/completed" element={<CompletedExpo />} />
        <Route path="/expo/ongoing" element={<OngoingExpo />} />
        <Route path="/expo/details/:expoUnqCode/:stallId" element={<ViewDetails />} />

        <Route path="/features" element={<Features />} />
        <Route path="/book-a-stall" element={<BookaStall />} />
        <Route path="/stall/create" element={<AddExecutive />} />
        <Route path="/stall/management/:id" element={<StallManagement />} />




        {/* --------------------- properties ------------------- */}
        <Route path='/property/add' element={<AddProperties />} />

        {/* -------------------- Meta -listings---------- */}

        <Route path="/meta-packages/active" element={<Activepakage />} />
        <Route path="/meta-package/buy" element={<BuyPakage />} />
        <Route path='/meta-listing/add' element={<AddMetaListing />} />

        {/* -------------------- Project Listing --------------- */}

        <Route path="/project/name" element={<ProjectName />} />
        <Route path="/projects/master" element={<MasterProjects />} />

        <Route path="/projects/active" element={<ActiveProjects />} />
        <Route path="/projects/inactive" element={<InActiveProjects />} />
        <Route path="/project/edit" element={<ProjectEdit />} />

        {/* /////---------- */}

        <Route path="/model/dashboard" element={<ModelDashboard />} />
        <Route path="/assignexe1" element={<AssignExeone />} />
        <Route path="/assignexe2" element={<AssignExetwo />} />

        {/*  Pages to implement  */}
        {/* <Route path="/noofexecutiveswise/:expoUnqCode/:stallId" element={<NoofExecutive />} /> */}
        <Route path="/noofexecutiveswise" element={<NoofExecutive />} />
        <Route path="/ebroucher" element={<Ebroucher />} />
        <Route path="/dropmessage" element={<DropMessage />} />
        <Route path="/enquirylist" element={<EnquiryList />} />
        <Route path="/whatsappcall" element={<WhatsappCall />} />
        <Route path="/listing-expos" element={<AllexpoListings />} />

        {/* Executive Pages */}
        <Route path="/executive-login" element={<ExecutiveLogin />} />
        <Route path="/executive-dashboard" element={<Executivedashboard />} />

        {/* Unused Routes or pages */}
        <Route path="/AddExecutivepone" element={<AddExecutivePone />} />
        <Route path="featuredetails" element={<FeatureDetails />} />
        <Route path="/addprojectname" element={<AddProjectName />} />
        <Route path="/addprojects" element={<AddProjects />} />
        <Route path="/addlistings" element={<AddListings />} />


        {/* Master lists */}


        <Route path="/masterprojects" element={<MasterProjectsname />} />
        <Route path="/masterprojectslist" element={<MasterProjectslist />} />
        <Route path="/masteractiveprojects" element={<MasteractiveProjects />} />
        <Route path="/masterinactiveprojects" element={<MasterinactiveProjects />} />
        <Route path="/masterrejectedprojects" element={<MasterrejectedProjects />} />

      </Routes>
    </Suspense>
  );
};

export default LazyLoad;
