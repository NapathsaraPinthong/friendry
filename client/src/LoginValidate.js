function Validation(values) {
    let errors = {}
    const student_id_valid = /^[0-9]{10}$/ //number0-9 exactly 10 
    const password_valid = /^[0-9]{8,}$/ //number0-9 at least 8 characters long

    if (values.student_id === "") {
        errors.student_id = "Student ID is required"
    }
    else if (!student_id_valid.test(values.student_id)) {
        errors.student_id = "Student ID is invalid"
    } else {
        errors.student_id = ""
    }

    if (values.password === "") {
        errors.password = "Password is required"
    }
    else if (!password_valid.test(values.password)) {
        errors.password = "Password must be at least 8 digits"
    } else {
        errors.password = ""
    }
    return errors;
}

export default Validation;
