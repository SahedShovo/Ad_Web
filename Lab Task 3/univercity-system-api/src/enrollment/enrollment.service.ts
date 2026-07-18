import { Injectable } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class EnrollmentService {
    //Inject CourseService via constructor: constructor(private courseService: CourseService)
    constructor(private courseService: CourseService) {}
    enrollStudent(studentName: string, courseId: string) {
        const course = this.courseService.getCourseById(courseId);

    return {
        message:'Student Enrolled Successfully',
        data: {
            studentName,
            course
        }
    }
}
getEnrollments() {
    return {
        message: `All enrollments fetched`,
        data: []
    }
}
}
