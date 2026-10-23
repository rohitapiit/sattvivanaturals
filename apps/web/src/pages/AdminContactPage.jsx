import React, {
  useEffect,
  useState,
} from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_URL;

const AdminContactPage = () => {

  const [contacts, setContacts] =
    useState([]);

    useEffect(() => {
  fetchContacts();

  const interval = setInterval(() => {
    fetchContacts();
  }, 3000);

  return () => clearInterval(interval);
}, []);

    const [selectedContact, setSelectedContact] =
  useState(null);

  const fetchContacts = async () => {

    try {

      const response =
        await fetch(
          `${API}/contact/admin`
        );

      const data =
        await response.json();

      if (data.success) {
        setContacts(
          data.contacts
        );
      }

    } catch (error) {
      console.error(error);
    }

  };

  const handleResolve = async (
  id
) => {

  try {

    const response =
      await fetch(
        `${API}/contact/${id}`,
        
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: "Resolved",
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {

      fetchContacts();

      toast.success("Query marked as resolved");

    }

  } catch (error) {

    console.error(error);

  }
};

const handleDelete = async (
  id
) => {

const result = await Swal.fire({
  title: "Delete Query?",
  text: "This query will be permanently deleted.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#16a34a",
  cancelButtonColor: "#dc2626",
  confirmButtonText: "Yes, Delete",
  cancelButtonText: "Cancel",
});

if (!result.isConfirmed) {
  return;
}

  try {

    const response =
      await fetch(
        `${API}/contact/${id}`,
        {
          method: "DELETE",
        }
      );

    const data =
      await response.json();

    if (data.success) {

      fetchContacts();

      toast.success("Query marked as resolved");

    }

  } catch (error) {

    console.error(error);

  }
};

  

  return (
    <div className="max-w-7xl mx-auto py-10">

      <div className="flex justify-between items-center mb-8">

<h1 className="text-3xl font-bold">
Contact Queries
</h1>

<button
onClick={fetchContacts}
className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
>
🔄 Refresh
</button>

</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {contacts.map(contact => (
  <div
    key={contact._id}
    className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
  >
    <h2 className="text-xl font-bold">
      {contact.fullName}
    </h2>

    <p>{contact.email}</p>

    <p>{contact.phone}</p>

    <p>{contact.subject}</p>

    <p>{contact.message}</p>

    <p className="mt-3 mb-2">
  Status:

  <span
  className={`inline-block ml-2 px-3 py-1 rounded-full text-white ${
    contact.status === "Resolved"
      ? "bg-green-600"
      : "bg-yellow-500"
  }`}
>
  {contact.status || "Pending"}
</span>
</p>
<div className="flex flex-wrap gap-2 mt-5">

<button
  onClick={() => setSelectedContact(contact)}
  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
>
  View
</button>

<button
  onClick={() => handleDelete(contact._id)}
  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
>
  Delete
</button>

{contact.status === "Pending" && (
  <button
    onClick={() => handleResolve(contact._id)}
    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
  >
    Mark Resolved
  </button>
)}

</div>


  </div>
))}
</div>

{
  selectedContact && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">

        <h2 className="text-2xl font-bold mb-6">
          Customer Details
        </h2>

        <p className="mb-3">
          <strong>Name:</strong>{" "}
          {selectedContact.fullName}
        </p>

        <p className="mb-3">
          <strong>Email:</strong>{" "}
          {selectedContact.email}
        </p>

        <p className="mb-3">
          <strong>Phone:</strong>{" "}
          {selectedContact.phone}
        </p>

        <p className="mb-3">
          <strong>Subject:</strong>{" "}
          {selectedContact.subject}
        </p>

        <p className="mb-6">
          <strong>Message:</strong>
          <br />
          {selectedContact.message}
        </p>

        <button
          onClick={() =>
            setSelectedContact(null)
          }
          className="bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>
  )
}
    </div>
  );
};

export default AdminContactPage;