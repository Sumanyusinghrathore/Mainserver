const apiBase = "http://localhost:3000";

// Fetch and display users
async function fetchUsers() {
  const response = await fetch(apiBase);
  const users = await response.json();

  const tableBody = document.getElementById("userTable");
  tableBody.innerHTML = ""; // Clear existing rows

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="editUser('${user._id}', '${user.name}', '${user.email}', '${user.password}')">Edit</button>
        <button onclick="deleteUser('${user._id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Add a new user
async function addUser(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch(apiBase, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  resetForm(); // Reset form after adding
  fetchUsers(); // Refresh the table
}

// Delete a user
async function deleteUser(id) {
    try {
      const response = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to delete user:", error);
        alert(error.error || "Failed to delete user");
        return;
      }
  
      alert("User deleted successfully!");
      fetchUsers(); // Refresh the table
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  }
  

// Edit an existing user
function editUser(id, name, department, email, password, scope) {
  // Populate the form fields with existing user data
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("password").value = password;

  // Show the "Update" button and hide the "Add User" button
  document.getElementById("addUser").style.display = "none";
  document.getElementById("updateUser").style.display = "inline";

  // Attach update functionality to the "Update" button
  document.getElementById("updateUser").onclick = async function () {
    await updateUser(id);
  };
}

// Update an existing user
async function updateUser(id) {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch(`${apiBase}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to update user:", error);
        alert(error.error || "Failed to update user.");
        return;
      }
  
      alert("User updated successfully!");
      resetForm(); // Reset form after updating
      fetchUsers(); // Refresh the table
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  }  

// Reset the form to its default state
function resetForm() {
  document.getElementById("addUserForm").reset();
  document.getElementById("addUser").style.display = "inline";
  document.getElementById("updateUser").style.display = "none";
}

// Initialize
document.getElementById("addUserForm").addEventListener("submit", addUser);
fetchUsers();
