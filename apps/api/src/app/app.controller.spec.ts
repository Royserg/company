import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Node } from './interfaces/node';
import { CreateNodeDto } from './dto/create-node.dto';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;
  let appService: AppService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getNodeChildren: jest.fn(),
            createNode: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  const mockNode: Node = {
    id: 'NODE_ID',
    name: 'Node',
    parentId: null,
    height: 0,
  };

  describe('createNode', () => {
    it(`should call service method 'createNode' with dto`, () => {
      const createNodeDto: CreateNodeDto = {
        name: 'NODE_NAME',
        parentId: 'PARENT_ID',
      };

      jest.spyOn(appService, 'createNode');

      appController.createNode(createNodeDto);

      expect(appService.createNode).toHaveBeenCalledTimes(1);
      expect(appService.createNode).toHaveBeenCalledWith(createNodeDto);
    });

    it(`should return newly created Node`, () => {
      const createNodeDto: CreateNodeDto = {
        name: 'NODE_NAME',
        parentId: 'PARENT_ID',
      };
      const newNode: Node = {
        id: 'NODE_ID',
        name: 'NODE_NAME',
        parentId: 'PARENT_ID',
        height: 1,
      };

      jest.spyOn(appService, 'createNode').mockReturnValue(newNode);

      const result = appController.createNode(createNodeDto);

      expect(result).toEqual(newNode);
    });
  });

  describe('getNodeChildren', () => {
    it(`should call service method 'getNodeChildren' with nodeId`, () => {
      const nodeId = 'NODE_ID';

      jest.spyOn(appService, 'getNodeChildren');

      appController.getNodeChildren(nodeId);

      expect(appService.getNodeChildren).toHaveBeenCalledTimes(1);
      expect(appService.getNodeChildren).toHaveBeenCalledWith(nodeId);
    });

    it(`should return list of Nodes`, () => {
      const nodeId = 'NODE_ID';
      jest.spyOn(appService, 'getNodeChildren').mockReturnValue([mockNode]);

      const result = appController.getNodeChildren(nodeId);
      const expected = [mockNode];

      expect(result).toEqual(expected);
    });
  });
});
