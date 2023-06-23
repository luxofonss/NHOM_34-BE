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
      type: "number",
      unit: "GB",
    },
  },
  {
    name: "primaryCameraResolution",
    detail: {
      name: { vi: "Độ phân giải camera chính" },
      type: "number",
      unit: "MP",
    },
  },
  {
    name: "numberOfPrimaryCamera",
    detail: {
      name: { vi: "Số camera" },
      type: "number",
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
      type: "number",
      unit: "Tháng",
    },
  },
  {
    name: "ram",
    detail: {
      name: { vi: "RAM" },
      type: "number",
      unit: "GB",
    },
  },
  {
    name: "rom",
    detail: {
      name: { vi: "ROM" },
      type: "number",
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
    name: "numberOfSIMCardSlot",
    detail: {
      name: { vi: "Số khe cắm sim" },
      type: "number",
    },
  },
  {
    name: "SIMType",
    detail: {
      name: { vi: "Loại sim" },
      type: "number",
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
      type: "number",
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
      type: "number",
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
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "number",
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
      type: "number",
      unit: "GB",
    },
  },
  {
    name: "primaryCameraResolution",
    detail: {
      name: { vi: "Độ phân giải camera" },
      type: "number",
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
      type: "number",
      unit: "Tháng",
    },
  },
  {
    name: "screenSize",
    detail: {
      name: { vi: "Kích thước màn hình" },
      type: "number",
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
      type: "number",
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
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "number",
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
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "number",
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
      type: "number",
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
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "number",
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
      type: "number",
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
      type: "number",
      unit: "mm"
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
      type: "number",
      unit: "m"
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
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "number",
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
    name: "numberPort",
    detail: {
      name: { vi: "Số cổng kết nối" },
      type: "number",
    },
  },
  {
    name: "inputStyle",
    detail: {
      name: { vi: "Kiểu đầu vào" },
      type: "number",
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
      type: "number",
      unit: "Tháng",
    },
  },
  {
    name: "capacity",
    detail: {
      name: { vi: "Dung lượng sạc" },
      type: "number",
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
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "number",
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
      type: "string",
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
      type: "number",
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
    name: "numberOfCors",
    detail: {
      name: { vi: "Số lõi" },
      type: "number",
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
      type: "number",
      unit: "GHz"
    },
  },
  {
    name: "weight",
    detail: {
      name: { vi: "Trọng lượng" },
      type: "number",
      unit: "kg",
    },
  },

  {
    name: "dimensions.L",
    detail: {
      name: { vi: "Chiều dài" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.W",
    detail: {
      name: { vi: "Chiều rộng" },
      type: "number",
      unit: "mm",
    },
  },
  {
    name: "dimensions.H",
    detail: {
      name: { vi: "Chiều cao" },
      type: "number",
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

module.exports = productAttribute;
