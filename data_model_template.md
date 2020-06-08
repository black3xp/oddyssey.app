# Table: Employees

- `Name`: Employees
- `Comment`: Employees

## `Primary Key`

- `Columns`: EmployeeID
- `Cluster`: `false`

## `Indexes[]`

| `Columns`           | `Cluster` | `Unique` |
| ------------------- | --------- | -------- |
| FirstName, LastName | `true`    | `false`  |
| LastName            | `false`   | `false`  |

## `Foreign Keys[]`

| `Columns`    | `Ref Table` | `Ref Columns` | `Options` |
| ------------ | ----------- | ------------- | --------- |
| DepartmentID | Departments | DepartmentID  |           |

## `Columns[]`

| `Label`    | `Name`       | `Type`             | `Nullable` | `Default` | `Comment` |
| ---------- | ------------ | ------------------ | ---------- | --------- | --------- |
| EmployeeID | EmployeeID   | int auto_increment | `false`    |           |           |
| Last Name  | LastName     | varchar(50)        | `false`    |           |           |
| First Name | FirstName    | varchar(50)        | `false`    |           |           |
| Department | DepartmentID | int                | `false`    |           |           |

