import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World Test!';
  }
}

//ON APP: postgres://yblyakxplkpjgy:e7f2e8a253c173bc109541df2a43ca05569720249d3dc3d4fe6ae79d2df61d65@ec2-44-214-132-149.compute-1.amazonaws.com:5432/d8psme9isosol7
// Actual: postgres://yblyakxplkpjgy:e7f2e8a253c173bc109541df2a43ca05569720249d3dc3d4fe6ae79d2df61d65@ec2-44-214-132-149.compute-1.amazonaws.com:5432/d8psme9isosol7
