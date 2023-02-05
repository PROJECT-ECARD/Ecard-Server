import { Guid } from "src/common/helpers/generate-guid.helper";
import { RegisterDto } from "../../core/auth/dto/in-register.dto";

export const users: RegisterDto = {
    id:  Guid.newGuid(), 
    email: 'admin@gmail.com', 
    password: 'admin', 
    confirmPassword: 'admin', 
    firstName: 'admin', 
    lastName: '', 
    phoneNumber: '0819490540',
    createdBy: 'admin'
}
