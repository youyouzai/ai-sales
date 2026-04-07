package com.salesstar.dto;

import com.salesstar.entity.Customer;
import com.salesstar.entity.CustomerVisit;
import lombok.Data;
import java.util.Arrays;
import java.util.List;

@Data
public class CustomerDTO {
    private Long id;
    private String name;
    private String phone;
    private Integer age;
    private String job;
    private String budget;
    private String segment;
    private List<String> tags;
    private Integer budgetActual;
    private List<String> purchased;
    private List<VisitDTO> visits;
    private String lastVisitDate;

    @Data
    public static class VisitDTO {
        private Long id;
        private String type;
        private String visitDate;
        private String note;

        public static VisitDTO from(CustomerVisit v) {
            VisitDTO dto = new VisitDTO();
            dto.id = v.getId();
            dto.type = v.getType();
            dto.visitDate = v.getVisitDate() != null ? v.getVisitDate().toString() : "";
            dto.note = v.getNote();
            return dto;
        }
    }

    public static CustomerDTO from(Customer c) {
        CustomerDTO dto = new CustomerDTO();
        dto.id = c.getId();
        dto.name = c.getName();
        dto.phone = c.getPhone();
        dto.age = c.getAge();
        dto.job = c.getJob();
        dto.budget = c.getBudget();
        dto.segment = c.getSegment();
        dto.tags = c.getTags() != null
            ? Arrays.stream(c.getTags().split(",")).map(String::trim).toList()
            : List.of();
        dto.budgetActual = c.getBudgetActual();
        dto.purchased = c.getPurchased() != null && !c.getPurchased().isBlank()
            ? Arrays.stream(c.getPurchased().split(",")).map(String::trim).toList()
            : List.of();
        if (c.getVisits() != null) {
            dto.visits = c.getVisits().stream().map(VisitDTO::from).toList();
            dto.lastVisitDate = dto.visits.isEmpty() ? "" : dto.visits.get(0).getVisitDate();
        } else {
            dto.visits = List.of();
            dto.lastVisitDate = "";
        }
        return dto;
    }
}
