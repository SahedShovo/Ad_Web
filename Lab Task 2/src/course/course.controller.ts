import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Post()
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Put(':id')
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto);
  }

  @Patch(':id')
  patchCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.patchCourse(id, updateCourseDto);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Post(':id/upload')
  @UseInterceptors(// This interceptor handles file uploads using Multer
    FileInterceptor('file', {
      storage: diskStorage({//Where File Storing 
        destination: './uploads',//Storing in uploads folder
        filename: (req, file, callback) => {//Generating unique file name
          const uniqueSuffix = Date.now();//Using timestamp as unique suffix
          const ext = extname(file.originalname);//Extracting file extension
          callback(null, `${uniqueSuffix}${ext}`);//Combining timestamp and extension for unique filename
        },
      }),
      fileFilter: (req, file, callback) => {//Filtering allowed file types
        const allowedExt = /\.(jpg|jpeg|png|pdf)$/i;//Checking its jpg, jpeg, png or pdf file
        if (!allowedExt.test(extname(file.originalname))) {//If not allowed file type, throw error
          return callback(
            new BadRequestException(//Error message for invalid file type
              'Only .jpg, .jpeg, .png and .pdf files are allowed',
            ),
            false,
          );
        }
        callback(null, true);//If allowed file type, proceed with upload
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  uploadCourseMaterial(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.courseService.uploadCourseMaterial(id, file);
  }
}
