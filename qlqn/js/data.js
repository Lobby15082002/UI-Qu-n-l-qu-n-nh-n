/* Dữ liệu mẫu — sau này thay bằng gọi API (fetch) */
window.MOCK = {
  statusBadge: { "Tại ngũ": "ok", "Đi học": "info", "Nghỉ phép": "warn", "Nằm viện": "danger" },

  org: {
    id: "sd3", name: "SƯ ĐOÀN 3", type: "root", children: [
      { id: "td1", name: "Tiểu đoàn 1", type: "battalion", count: 156, children: [
        { id: "dd11", name: "Đại đội 11", type: "company", count: 52 },
        { id: "dd12", name: "Đại đội 12", type: "company", count: 51 },
        { id: "dd13", name: "Đại đội 13", type: "company", count: 53 }
      ]},
      { id: "td2", name: "Tiểu đoàn 2", type: "battalion", count: 148, children: [] },
      { id: "td3", name: "Tiểu đoàn 3", type: "battalion", count: 152, children: [] }
    ]
  },

  personnel: {
    dd12: [
      { id: "QN001245", name: "Nguyễn Văn A", rank: "Thượng sĩ", position: "Trung đội trưởng", status: "Tại ngũ" },
      { id: "QN001246", name: "Trần Văn B", rank: "Trung sĩ", position: "Tiểu đội trưởng", status: "Tại ngũ" },
      { id: "QN001247", name: "Lê Văn C", rank: "Hạ sĩ", position: "Chiến sĩ", status: "Nghỉ phép" },
      { id: "QN001248", name: "Phạm Văn D", rank: "Trung sĩ", position: "Chiến sĩ", status: "Tại ngũ" },
      { id: "QN001249", name: "Hoàng Văn E", rank: "Thượng sĩ", position: "Tiểu đội trưởng", status: "Đi học" }
    ]
  },

  // Chi tiết theo mã quân nhân; mã nào chưa có sẽ hiển thị "—"
  details: {
    QN001245: {
      personal: [["Mã quân nhân", "QN001245", true], ["CCCD", "048098012345", true], ["Họ và tên", "Nguyễn Văn A"], ["Ngày sinh", "12/03/1998"], ["Dân tộc", "Kinh"], ["Tôn giáo", "Không"], ["Quê quán", "Đà Nẵng"], ["Chỗ ở hiện nay", "K12 Lê Duẩn, Hải Châu, Đà Nẵng"]],
      military: [["Ngày nhập ngũ", "01/03/2018"], ["Cấp bậc", "Thượng sĩ"], ["Chức vụ", "Trung đội trưởng"], ["Đơn vị hiện tại", "Đại đội 12, Tiểu đoàn 1"], ["Đơn vị cũ", "Đại đội 7, Tiểu đoàn 2"], ["Trình độ", "Trung cấp"]],
      politics: [["Ngày vào Đoàn", "26/03/2013"], ["Ngày kết nạp Đảng", "15/05/2020"], ["Nơi kết nạp Đảng", "Chi bộ Đại đội 7"], ["Người giới thiệu thứ nhất", "Trần Quốc P."], ["Người giới thiệu thứ hai", "Lê Minh T."]],
      equipment: [["Quân phục thường dùng", "3 bộ", "10/03/2025", "Tốt"], ["Giày da", "2 đôi", "10/03/2025", "Tốt"], ["Mũ cứng", "1 cái", "15/01/2024", "Cần thay"], ["Ba lô", "1 cái", "15/01/2024", "Tốt"]],
      family: [["Cha", "Nguyễn Văn H", "1968", "Nông dân"], ["Mẹ", "Trần Thị L", "1972", "Buôn bán"], ["Em trai", "Nguyễn Văn K", "2003", "Sinh viên"]],
      discipline: [["08/06/2022", "Khiển trách", "Vi phạm giờ giấc", "QĐ-114/ĐĐ12"]],
      rewards: [["2025", "Chiến sĩ thi đua", "Tiểu đoàn", "QĐ-031/TĐ1"], ["2024", "Giấy khen", "Đại đội", "QĐ-087/ĐĐ12"], ["2023", "Hoàn thành tốt nhiệm vụ", "Sư đoàn", "QĐ-402/SĐ3"]]
    }
  }
};
