"use strict";

let productAttribute = new Map();

const attributeMobileList = [
  {
    name: "phoneModel",
    detail: {
      name: { vi: "Model điện thoại" },
      type: "text",
    },
  },
  {
    name: "phoneType",
    detail: {
      name: { vi: "Loaị điện thoại" },
      type: "text",
    },
  },
  {
    name: "storeCapacity",
    detail: {
      name: { vi: "Dung lượng lưu trữ" },
      type: "n",
      unit: "GB",
    },
  },
  {
    name: "primaryCameraResolution",
    detail: {
      name: { vi: "Độ phân giải camera chính" },
      type: "n",
      unit: "MP",
    },
  },
  {
    name: "nOfPrimaryCamera",
    detail: {
      name: { vi: "Số camera" },
      type: "n",
      unit: "MP",
    },
  },
  {
    name: "warrantyType",
    detail: {
      name: { vi: "Loại bảo hành" },
      type: "select",
      selections: [
        { name: "Bảo hành nhà cung cấp", value: "Bảo hành nhà cung cấp" },
        { name: "Bảo hành nhà sản xuất", value: "Bảo hành nhà sản xuất" },
        { name: "Bảo hành quốc tế", value: "Bảo hành quốc tế" },
        { name: "Không bảo hành", value: "Không bảo hành" },
      ],
    },
  },
  {
    name: "warrantyDuration",
    detail: {
      name: { vi: "Thời hạn bảo hành" },
      type: "n",
      unit: "Tháng",
    },
  },
  {
    name: "ram",
    detail: {
      name: { vi: "RAM" },
      type: "n",
      unit: "GB",
    },
  },
  {
    name: "rom",
    detail: {
      name: { vi: "ROM" },
      type: "n",
      unit: "GB",
    },
  },
  {
    name: "supportOperatingSystem",
    detail: {
      name: { vi: "Hỗ trợ hệ điều hành" },
      type: "text",
    },
  },
  {
    name: "nOfSIMCardSlot",
    detail: {
      name: { vi: "Số khe cắm sim" },
      type: "n",
    },
  },
  {
    name: "SIMType",
    detail: {
      name: { vi: "Loại sim" },
      type: "n",
    },
  },
  {
    name: "caseType",
    detail: {
      name: { vi: "Loại ốp" },
      type: "text",
    },
  },
  {
    name: "screenSize",
    detail: {
      name: { vi: "Kích thước màn hình" },
      type: "n",
      unit: "inches",
    },
  },
  {
    name: "processorType",
    detail: {
      name: { vi: "Bộ xử lý" },
      type: "text",
    },
  },
  {
    name: "mobilePhoneFeatures",
    detail: {
      name: { vi: "Tính năng" },
      type: "text",
    },
  },
  {
    name: "cellular",
    detail: {
      name: { vi: "Điện thoại di động" },
      type: "text",
    },
  },
  {
    name: "mobileCableTypes",
    detail: {
      name: { vi: "Loại cáp điện thoại" },
      type: "text",
    },
  },
  {
    name: "screenProtectorType",
    detail: {
      name: { vi: "Loại miếng dán bảo vệ màn hình" },
      type: "text",
    },
  },
  {
    name: "batteryCapacity.value",
    detail: {
      name: { vi: "Dung lượng pin" },
      type: "n",
    },
  },
  {
    name: "batteryCapacity.unit",
    detail: {
      name: { vi: "Đơn vị pin" },
      type: "select",
      selections: [
        { name: "mAh", value: "mAh" },
        { name: "cell", value: "cell" },
        { name: "Wh", value: "Wh" },
      ],
    },
  },
  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];

const attributeTabletList = [
  {
    name: "tabletModel",
    detail: {
      name: { vi: "Model máy tính bảng" },
      type: "text",
    },
  },
  {
    name: "tabletType",
    detail: {
      name: { vi: "Loaị máy tính bảng" },
      type: "text",
    },
  },
  {
    name: "storeCapacity",
    detail: {
      name: { vi: "Dung lượng lưu trữ" },
      type: "n",
      unit: "GB",
    },
  },
  {
    name: "primaryCameraResolution",
    detail: {
      name: { vi: "Độ phân giải camera" },
      type: "n",
      unit: "MP",
    },
  },
  {
    name: "warrantyType",
    detail: {
      name: { vi: "Loại bảo hành" },
      type: "select",
      selections: [
        { name: "Bảo hành nhà cung cấp", value: "Bảo hành nhà cung cấp" },
        { name: "Bảo hành nhà sản xuất", value: "Bảo hành nhà sản xuất" },
        { name: "Bảo hành quốc tế", value: "Bảo hành quốc tế" },
        { name: "Không bảo hành", value: "Không bảo hành" },
      ],
    },
  },
  {
    name: "warrantyDuration",
    detail: {
      name: { vi: "Thời hạn bảo hành" },
      type: "n",
      unit: "Tháng",
    },
  },
  {
    name: "screenSize",
    detail: {
      name: { vi: "Kích thước màn hình" },
      type: "n",
      unit: "inches",
    },
  },
  {
    name: "tabletCableTypes",
    detail: {
      name: { vi: "Loại cáp máy tính bảng" },
      type: "text",
    },
  },
  {
    name: "EReader",
    detail: {
      name: { vi: "Thiết bị đọc điện tử" },
      type: "boolean",
    },
  },
  {
    name: "batteryCapacity.value",
    detail: {
      name: { vi: "Dung lượng pin" },
      type: "n",
    },
  },
  {
    name: "batteryCapacity.unit",
    detail: {
      name: { vi: "Đơn vị pin" },
      type: "select",
      selections: [
        { name: "mAh", value: "mAh" },
        { name: "cell", value: "cell" },
        { name: "Wh", value: "Wh" },
      ],
    },
  },
  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];
const attributeJacketList = [
  {
    name: "brand",
    detail: {
      name: { vi: "thương hiệu" },
      type: "text",
    },
  },
  {
    name: "material",
    detail: {
      name: { vi: "Chất liệu" },
      type: "text",
    },
  },
  {
    name: "skinType",
    detail: {
      name: { vi: "Loại da" },
      type: "text",
    },
  },
  {
    name: "buttonStyle",
    detail: {
      name: { vi: "Kiểu nút" },
      type: "text",
    },
  },
  {
    name: "tallFit",
    detail: {
      name: { vi: "Tall Fit" },
      type: "boolean",
    },
  },
  {
    name: "lengthSteve",
    detail: {
      name: { vi: "Chiều dài tay áo" },
      type: "text",
    },
  },
  {
    name: "jacketModel",
    detail: {
      name: { vi: "Loại áo" },
      type: "select",
      selections: [
        { name: "Họa tiết", value: "Họa tiết" },
        { name: "Sọc caro", value: "Sọc caro" },
        { name: "Hoa", value: "Hoa" },
        { name: "Khác", value: "Khác" },
      ],
    },
  },
  {
    name: "style",
    detail: {
      name: { vi: "Phong cách" },
      type: "select",
      selections: [
        { name: "Thể thao", value: "Thể thao" },
        { name: "Cơ bản", value: "Cơ bản" },
        { name: "Hàn Quốc", value: "Hàn Quốc" },
        { name: "Công sở", value: "Công sở" },
      ],
    },
  },
  {
    name: "veryBig",
    detail: {
      name: { vi: "Rât lớn" },
      type: "boolean",
    },
  },
  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];
const attributeMonitorList = [
  {
    name: "brand",
    detail: {
      name: { vi: "thương hiệu" },
      type: "text",
    },
  },
  {
    name: "size",
    detail: {
      name: { vi: "Kích thước màn hình" },
      type: "text",
    },
  },
  {
    name: "panelType",
    detail: {
      name: { vi: "Kiểu Panel" },
      type: "text",
    },
  },
  {
    name: "weight",
    detail: {
      name: { vi: "Cân nặng" },
      type: "n",
    },
  },
  {
    name: "gameFocus",
    detail: {
      name: { vi: "Gaming Focused" },
      type: "boolean",
    },
  },
  {
    name: "monitorInterfaceType",
    detail: {
      name: { vi: "Loại giao diện màn hình" },
      type: "text",
    },
  },
  {
    name: "resolution",
    detail: {
      name: { vi: "Nghị quyết" },
      type: "select",
      selections: [
        { name: "4K UHD", value: "4K UHD" },
        { name: "8K UHD", value: "8K UHD" },
        { name: "Full HD", value: "Full HD" },
        { name: "HD", value: "HD" },
      ],
    },
  },
  {
    name: "condition",
    detail: {
      name: { vi: "Trạng thái" },
      type: "select",
      selections: [
        { name: "Mới", value: "Mới" },
        { name: "Đã qua sử dụng", value: "Đã qua sử dụng" },
      ],
    },
  },
  {
    name: "veryBig",
    detail: {
      name: { vi: "Rât lớn" },
      type: "boolean",
    },
  },
  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];

const attributeWatchList = [
  {
    name: "brand",
    detail: {
      name: { vi: "Thương hiệu" },
      type: "text",
    },
  },
  {
    name: "caseStyle",
    detail: {
      name: { vi: "Kiểu vỏ đồng hồ" },
      type: "text",
    },
  },
  {
    name: "buckleStyle",
    detail: {
      name: { vi: "Kiểu khóa đồng hồ" },
      type: "text",
    },
  },
  {
    name: "clockFace",
    detail: {
      name: { vi: "Mặt đồng hồ" },
      type: "n",
    },
  },
  {
    name: "glass",
    detail: {
      name: { vi: "Kính đồng hồ" },
      type: "text",
    },
  },
  {
    name: "warrantyType",
    detail: {
      name: { vi: "Loại bảo hành" },
      type: "select",
      selections: [
        { name: "Bảo hành nhà cung cấp", value: "Bảo hành nhà cung cấp" },
        { name: "Bảo hành nhà sản xuất", value: "Bảo hành nhà sản xuất" },
        { name: "Bảo hành quốc tế", value: "Bảo hành quốc tế" },
        { name: "Không bảo hành", value: "Không bảo hành" },
      ],
    },
  },
  {
    name: "clockStyle",
    detail: {
      name: { vi: "Kiểu đồng hồ" },
      type: "text",
    },
  },
  {
    name: "diameter",
    detail: {
      name: { vi: "Đường kính vỏ đồng hồ" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "watchCaseMaterial",
    detail: {
      name: { vi: "Chất liệu vỏ đồng hồ" },
      type: "text",
    },
  },
  {
    name: "depthWater",
    detail: {
      name: { vi: "Độ sâu chống nước" },
      type: "n",
      unit: "m",
    },
  },
  {
    name: "origin",
    detail: {
      name: { vi: "Xuất xứ" },
      type: "text",
    },
  },
  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];
const attributeBackupChargerList = [
  {
    name: "brand",
    detail: {
      name: { vi: "Thương hiệu" },
      type: "text",
    },
  },
  {
    name: "nPort",
    detail: {
      name: { vi: "Số cổng kết nối" },
      type: "n",
    },
  },
  {
    name: "inputStyle",
    detail: {
      name: { vi: "Kiểu đầu vào" },
      type: "n",
      unit: "GB",
    },
  },
  {
    name: "warrantyType",
    detail: {
      name: { vi: "Loại bảo hành" },
      type: "select",
      selections: [
        { name: "Bảo hành nhà cung cấp", value: "Bảo hành nhà cung cấp" },
        { name: "Bảo hành nhà sản xuất", value: "Bảo hành nhà sản xuất" },
        { name: "Bảo hành quốc tế", value: "Bảo hành quốc tế" },
        { name: "Không bảo hành", value: "Không bảo hành" },
      ],
    },
  },
  {
    name: "warrantyDuration",
    detail: {
      name: { vi: "Thời hạn bảo hành" },
      type: "n",
      unit: "Tháng",
    },
  },
  {
    name: "capacity",
    detail: {
      name: { vi: "Dung lượng sạc" },
      type: "n",
      unit: "mAh",
    },
  },
  {
    name: "cableType",
    detail: {
      name: { vi: "Loại cáp sạc dự phòng" },
      type: "text",
    },
  },
  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];

const attributeDesktopComputerList = [
  {
    name: "brand",
    detail: {
      name: { vi: "Thương hiệu" },
      type: "text",
    },
  },
  {
    name: "port",
    detail: {
      name: { vi: "Cổng/ Giao diện" },
      type: "text",
    },
  },
  {
    name: "processor",
    detail: {
      name: { vi: "Vi xử lý" },
      type: "text",
    },
  },
  {
    name: "warrantyType",
    detail: {
      name: { vi: "Loại bảo hành" },
      type: "select",
      selections: [
        { name: "Bảo hành nhà cung cấp", value: "Bảo hành nhà cung cấp" },
        { name: "Bảo hành nhà sản xuất", value: "Bảo hành nhà sản xuất" },
        { name: "Bảo hành quốc tế", value: "Bảo hành quốc tế" },
        { name: "Không bảo hành", value: "Không bảo hành" },
      ],
    },
  },
  {
    name: "warrantyDuration",
    detail: {
      name: { vi: "Thời hạn bảo hành" },
      type: "n",
      unit: "Tháng",
    },
  },
  {
    name: "storage",
    detail: {
      name: { vi: "Loại lưu trữ" },
      type: "select",
      selections: [
        { name: "HDD", value: "HDD" },
        { name: "SSD", value: "SSD" },
        { name: "HDD + SSD", value: "HDD + SSD" },
      ],
    },
  },
  {
    name: "operationSystem",
    detail: {
      name: { vi: "Hệ điều hành" },
      type: "text",
    },
  },
  {
    name: "capacity",
    detail: {
      name: { vi: "Dung lượng lưu trữ" },
      type: "text",
      unit: "GB",
    },
  },
  {
    name: "nOfCors",
    detail: {
      name: { vi: "Số lõi" },
      type: "n",
    },
  },
  {
    name: "cdDriver",
    detail: {
      name: { vi: "Ổ đĩa quang" },
      type: "text",
    },
  },
  {
    name: "status",
    detail: {
      name: { vi: "Tình trạng" },
      type: "text",
    },
  },
  {
    name: "CPUfrequency",
    detail: {
      name: { vi: "Tần số CPU" },
      type: "n",
      unit: "GHz",
    },
  },
  {
    name: "weight",
    detail: {
      name: { vi: "Trọng lượng" },
      type: "n",
      unit: "kg",
    },
  },

  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];
const attributeSpeakerList = [
  {
    name: "brand",
    detail: {
      name: { vi: "Thương hiệu" },
      type: "text",
    },
  },
  {
    name: "compatibleAudioDevice",
    detail: {
      name: { vi: "Thiết bị âm thanh tương thích" },
      type: "text",
    },
  },
  {
    name: "frequency",
    detail: {
      name: { vi: "Tần số" },
      type: "n",
      unit: "Hz",
    },
  },
  {
    name: "warrantyType",
    detail: {
      name: { vi: "Loại bảo hành" },
      type: "select",
      selections: [
        { name: "Bảo hành nhà cung cấp", value: "Bảo hành nhà cung cấp" },
        { name: "Bảo hành nhà sản xuất", value: "Bảo hành nhà sản xuất" },
        { name: "Bảo hành quốc tế", value: "Bảo hành quốc tế" },
        { name: "Không bảo hành", value: "Không bảo hành" },
      ],
    },
  },
  {
    name: "warrantyDuration",
    detail: {
      name: { vi: "Thời hạn bảo hành" },
      type: "n",
      unit: "Tháng",
    },
  },
  {
    name: "bluetooth",
    detail: {
      name: { vi: "Kết nối bluetooth" },
      type: "select",
      selections: [
        { name: "Có", value: "yes" },
        { name: "Không", value: "no" },
      ],
    },
  },
  {
    name: "wattage",
    detail: {
      name: { vi: "Công suất" },
      type: "text",
    },
  },
  {
    name: "connectionType",
    detail: {
      name: { vi: "Kiểu kết nối" },
      type: "text",
    },
  },
  {
    name: "sensitivity",
    detail: {
      name: { vi: "Độ nhạy" },
      type: "text",
    },
  },
  {
    name: "smartSpeaker",
    detail: {
      name: { vi: "Loa thông minh" },
      type: "select",
      selections: [
        { name: "Có", value: "yes" },
        { name: "Không", value: "no" },
      ],
    },
  },
  {
    name: "type",
    detail: {
      name: { vi: "Loại loa" },
      type: "text",
    },
  },
  {
    name: "amliType",
    detail: {
      name: { vi: "Loại Amli" },
      type: "text",
    },
  },
  {
    name: "weight",
    detail: {
      name: { vi: "Trọng lượng" },
      type: "n",
      unit: "kg",
    },
  },

  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];
const attributeLaptopList = [
  {
    name: "brand",
    detail: {
      name: { vi: "Thương hiệu" },
      type: "text",
    },
  },
  {
    name: "laptopModel",
    detail: {
      name: { vi: "Laptop Model" },
      type: "text",
    },
  },
  {
    name: "laptopType",
    detail: {
      name: { vi: "Loại Laptop" },
      type: "text",
    },
  },
  {
    name: "graphicCard",
    detail: {
      name: { vi: "Card đồ họa" },
      type: "text",
    },
  },
  {
    name: "battery",
    detail: {
      name: { vi: "Pin" },
      type: "number",
      unit: "mAh",
    },
  },

  {
    name: "port",
    detail: {
      name: { vi: "Cổng/ Giao diện" },
      type: "text",
    },
  },
  {
    name: "processor",
    detail: {
      name: { vi: "Vi xử lý" },
      type: "text",
    },
  },
  {
    name: "warrantyType",
    detail: {
      name: { vi: "Loại bảo hành" },
      type: "select",
      selections: [
        { name: "Bảo hành nhà cung cấp", value: "Bảo hành nhà cung cấp" },
        { name: "Bảo hành nhà sản xuất", value: "Bảo hành nhà sản xuất" },
        { name: "Bảo hành quốc tế", value: "Bảo hành quốc tế" },
        { name: "Không bảo hành", value: "Không bảo hành" },
      ],
    },
  },
  {
    name: "warrantyDuration",
    detail: {
      name: { vi: "Thời hạn bảo hành" },
      type: "n",
      unit: "Tháng",
    },
  },
  {
    name: "storage",
    detail: {
      name: { vi: "Loại lưu trữ" },
      type: "select",
      selections: [
        { name: "HDD", value: "HDD" },
        { name: "SSD", value: "SSD" },
        { name: "HDD + SSD", value: "HDD + SSD" },
      ],
    },
  },
  {
    name: "operationSystem",
    detail: {
      name: { vi: "Hệ điều hành" },
      type: "text",
    },
  },
  {
    name: "capacity",
    detail: {
      name: { vi: "Dung lượng lưu trữ" },
      type: "text",
      unit: "GB",
    },
  },
  {
    name: "nOfCors",
    detail: {
      name: { vi: "Số lõi" },
      type: "n",
    },
  },
  {
    name: "status",
    detail: {
      name: { vi: "Tình trạng" },
      type: "text",
    },
  },
  {
    name: "CPUfrequency",
    detail: {
      name: { vi: "Tần số CPU" },
      type: "n",
      unit: "GHz",
    },
  },
  {
    name: "weight",
    detail: {
      name: { vi: "Trọng lượng" },
      type: "n",
      unit: "kg",
    },
  },

  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];
const attributeCameraList = [
  {
    name: "brand",
    detail: {
      name: { vi: "Thương hiệu" },
      type: "text",
    },
  },
  {
    name: "cameraModel",
    detail: {
      name: { vi: "Camera Model" },
      type: "text",
    },
  },
  {
    name: "lensType",
    detail: {
      name: { vi: "Loại ống kính" },
      type: "text",
    },
  },
  {
    name: "screenSize",
    detail: {
      name: { vi: "Kích thước màn hình" },
      type: "n",
      unit: "inches",
    },
  },
  {
    name: "resolution",
    detail: {
      name: { vi: "Độ phân giải" },
      type: "n",
      unit: "p",
    },
  },

  {
    name: "aperture",
    detail: {
      name: { vi: "Khẩu độ" },
      type: "text",
    },
  },
  {
    name: "memoryCard",
    detail: {
      name: { vi: "Loại thẻ nhớ" },
      type: "text",
    },
  },
  {
    name: "warrantyType",
    detail: {
      name: { vi: "Loại bảo hành" },
      type: "select",
      selections: [
        { name: "Bảo hành nhà cung cấp", value: "Bảo hành nhà cung cấp" },
        { name: "Bảo hành nhà sản xuất", value: "Bảo hành nhà sản xuất" },
        { name: "Bảo hành quốc tế", value: "Bảo hành quốc tế" },
        { name: "Không bảo hành", value: "Không bảo hành" },
      ],
    },
  },
  {
    name: "warrantyDuration",
    detail: {
      name: { vi: "Thời hạn bảo hành" },
      type: "n",
      unit: "Tháng",
    },
  },
  {
    name: "batteryType",
    detail: {
      name: { vi: "Loại pin" },
      type: "select",
      selections: [
        { name: "23A", value: "23A" },
        { name: "AA", value: "AA" },
        { name: "AAA", value: "AAA" },
      ],
    },
  },
  {
    name: "waterproof",
    detail: {
      name: { vi: "Chống nước" },
      type: "select",
      selections: [
        { name: "Có", value: "yes" },
        { name: "Không", value: "no" },
      ],
    },
  },
  {
    name: "frameRate",
    detail: {
      name: { vi: "Tốc độ khung hình" },
      type: "text",
      unit: "fps",
    },
  },
  {
    name: "standardRange",
    detail: {
      name: { vi: "Phạm vi tiêu chuẩn" },
      type: "n",
      unit: "ISO",
    },
  },
  {
    name: "weight",
    detail: {
      name: { vi: "Trọng lượng" },
      type: "n",
      unit: "kg",
    },
  },

  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "n",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "n",
      unit: "mm",
    },
  },
];

attributeMobileList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});
attributeTabletList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});
attributeJacketList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});
attributeMonitorList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});
attributeWatchList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});
attributeDesktopComputerList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});
attributeBackupChargerList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});

attributeLaptopList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});

attributeSpeakerList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});

attributeCameraList.forEach((attribute) => {
  productAttribute.set(attribute.name, {
    ...attribute.detail,
    path: attribute.name,
  });
});

module.exports = productAttribute;
