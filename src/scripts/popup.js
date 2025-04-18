// DONE
document.getElementById("login").addEventListener("click", function() {
    // Chuyển hướng đến trang OAuth của Google
    window.open("http://localhost:3000/auth/google", "_blank");
});

async function fetchToken() {
    const response = await fetch("http://localhost:3000/auth/getToken", {
        credentials: "include", // Giữ session để lấy token từ backend
    });
    const data = await response.json();

    if (data) {
        console.log("✅ Token nhận được từ session:", data.token.access_token);
        localStorage.setItem("gmail_token", data.token.access_token);

        // Sau khi nhận token, chuyển hướng người dùng tới Gmail
        window.location.href = "https://mail.google.com/";  // Chuyển hướng đến Gmail
    } else {
        console.error("❌ Không tìm thấy token.");
    }
}

// Gọi fetchToken khi trang dashboard tải xong
window.onload = fetchToken;

// Xử lý tóm tắt email
document.getElementById("summarize").addEventListener("click", async function () {
    try {
        const response = await  ("http://localhost:3000/api/emails/summarize-email", {
            method: "GET",
            credentials: "include" // ⚡ Giữ session để xác thực OAuth2
        });

        if (!response.ok) {
            throw new Error("❌ Lỗi API: " + response.statusText);
        }

        const data = await response.json();
        document.getElementById("summary").textContent = data.summary || "Không có email nào.";
    } catch (error) {
        console.error("❌ Lỗi khi lấy email:", error);
        document.getElementById("summary").textContent = "Lỗi khi lấy email.";
    }
});



// Xử lý gọi 5 email
document.getElementById("get5Emails").addEventListener("click", async function () {
    console.log("Nút 'Lấy 5 Email' đã được nhấn");
    const token = localStorage.getItem('gmail_token'); // Hoặc localStorage

    try {
        // Gửi yêu cầu GET tới API để lấy 5 email mới nhất
        const response = await fetch("http://localhost:3000/api/emails/5-latest-emails", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        // Kiểm tra nếu response không thành công
        if (!response.ok) {
            throw new Error("❌ Lỗi API: " + response.statusText);
        }

        // Chuyển dữ liệu trả về từ API sang JSON
        const data = await response.json();

        // Log ra dữ liệu để kiểm tra
        console.log("Dữ liệu nhận được:", data);

        // Hiển thị danh sách email lên giao diện dưới dạng bảng
        const emailList = data.map(email => 
            `<tr>
                <td>${email.subject}</td>
                <td>${email.from}</td>
                <td>${email.date}</td>
            </tr>`
        ).join('');
        
        document.getElementById("emailSummary").innerHTML = `<table><thead><tr><th>Subject</th><th>Sender</th><th>Date</th></tr></thead><tbody>${emailList}</tbody></table>`;
    } catch (error) {
        console.error("❌ Lỗi khi lấy email:", error);
        document.getElementById("emailSummary").textContent = "Lỗi khi lấy email.";
    }
});
