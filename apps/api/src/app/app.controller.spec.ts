import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Node } from './interfaces/node';

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

  describe('getNodeChildren', () => {
    it(`should call service method 'getNodeChildren' passing nodeId`, () => {
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
