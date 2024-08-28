import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddExpense from "./pages/AddExpense";
import ExpensesPage from "./pages/ExpensesPage"; // Import the ExpensesPage
import { useAppContext } from "./contexts/AppContext";
import LoggedLayout from "./pages/LoggedLayout";
import UpdateExpense from "./pages/UpdateExpense";
import Balance from "./pages/Balance"
// CORS conflicts in development were fixed using a proxy in frontend package.json. 

export default function App() {
  const { isLoggedIn } = useAppContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          isLoggedIn ? 
           ( <Layout><div className="flex flex-col space-y-10"><div className="lg:w-2/3 mx-auto border lg:p-6 sm:p-1 md:p-3 rounded-lg shadow-lg "><AddExpense  /></div> <ExpensesPage/></div></Layout>):
           (<Layout><Register /></Layout>)
           } />
        <Route path="/search" element={<Layout><p>Search page</p></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/sign-in" element={<Layout><SignIn /></Layout>} />

        {/* Restricted Routes */}
        {isLoggedIn && (
          <>
            <Route
              path="/add-expense"
              element={
                <LoggedLayout>
                  <AddExpense />
                </LoggedLayout>
              }
            />
            <Route
              path="/expenses"
              element={
                <LoggedLayout>
                  <ExpensesPage />
                </LoggedLayout>
              }
            />

            <Route
              path="/update-expense/:id"
              element={
                <LoggedLayout>
                  <UpdateExpense />
                </LoggedLayout>
              }
            />
            <Route
              path="/balance"
              element={
                <LoggedLayout>
                  <Balance />
                </LoggedLayout>
              }
            />
          </>
        )}

        <Route path="*" element={<Layout><p>404 Not Found</p></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
