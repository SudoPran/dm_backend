function mapOrderDTO(object) {
    dto = {
        "_id": "",
        "product_ids": [],
        "quantities": [],
        "date_created": "",
        "date_modified": "",
        "status": "",
        "total_cost": 0
    };

    if (object) {
        dto._id = object.order_id;
        dto.product_ids = object.product_ids;
        dto.quantities = [object.quantities];
        dto.date_created = object.date_created;
        dto.date_modified = object.date_modified;
        dto.status = object.order_status,
        dto.total_cost = object.total_cost
        return dto;
    }
    return null;
}

module.exports = {
    mapOrderDTO
}