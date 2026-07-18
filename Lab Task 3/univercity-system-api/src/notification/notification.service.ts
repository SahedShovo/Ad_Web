import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EnrollmentService } from 'src/enrollment/enrollment.service';

@Injectable()
export class NotificationService {
    //Inject EnrollmentService using @Inject(forwardRef(() => EnrollmentService))
    constructor(
        @Inject(forwardRef(() => EnrollmentService))
        private enrollmentService: EnrollmentService,
    ){}

    sendNotification(studentName: string, message: string) {
        return {
            massage: 'Notification',

            data:
            studentName,
        }
    }
    checkEnrollmentAndNotify(studentName: string, courseId: string){
        const enrollments = this.enrollmentService.getEnrollments();
        return enrollments;
    }

}
