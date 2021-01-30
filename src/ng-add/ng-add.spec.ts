import { Tree, SchematicContext } from '@angular-devkit/schematics';
import { ngAdd } from './ng-add';

const PROJECT_NAME = 'pie-ka-chu';
const PROJECT_ROOT = 'pirojok';
const OTHER_PROJECT_NAME = "pi-catch-you";
const ADD_OPTIONS = {
  project: 'pie-ka-chu',
  appName:'example',
  herokuApiToken:'4fw5ef45'
};
const OTHER_ADD_OPTIONS = {
  project: 'pi-catch-you',
  appName:'example',
  herokuApiToken:'4fw5ef45'
};

describe('ng-add', () => {
  describe('generating files', () => {
    let tree: Tree;

    beforeEach(() => {
      tree = Tree.empty();
      tree.create('angular.json', JSON.stringify(generateAngularJson()));
    });

    it('generates new files if starting from scratch', async () => {
      const result = ngAdd(ADD_OPTIONS)(tree, {} as SchematicContext);
      expect(result.read('angular.json')!.toString()).toEqual(initialAngularJson);
    });

    it('overrides existing files', async () => {

      const tempTree = ngAdd(ADD_OPTIONS)(tree, {} as SchematicContext);

      const result = ngAdd(OTHER_ADD_OPTIONS)(tempTree, {} as SchematicContext);

      const actual = result.read('angular.json')!.toString();

      expect(actual).toEqual(overwriteAngularJson);
    });
  });

  describe('error handling', () => {
    it('fails if project not defined', () => {

      const tree = Tree.empty();
      var angularJSON: any = generateAngularJson();
      delete angularJSON.defaultProject;
      
      tree.create('angular.json', JSON.stringify(angularJSON));

      expect(() =>
        ngAdd({project: '',herokuApiToken:'',appName:''})(tree, {} as SchematicContext)
      ).toThrowError('No Angular project selected and no default project in the workspace');
    });

    it('Should throw if angular.json not found', async () => {
      expect(() =>
        ngAdd(ADD_OPTIONS)(Tree.empty(), {} as SchematicContext)
      ).toThrowError('Could not find angular.json');
    });

    it('Should throw if angular.json can not be parsed', async () => {
      const tree = Tree.empty();
      tree.create('angular.json', 'hi');

      expect(() =>
        ngAdd(ADD_OPTIONS)(tree, {} as SchematicContext)
      ).toThrowError('Could not parse angular.json');
    });

    it('Should throw if specified project does not exist ', async () => {
      const tree = Tree.empty();
      tree.create('angular.json', JSON.stringify({ projects: {} }));

      expect(() =>
        ngAdd(ADD_OPTIONS)(tree, {} as SchematicContext)
      ).toThrowError('The specified Angular project is not defined in this workspace');
    });

    it('Should throw if specified project is not application', async () => {
      const tree = Tree.empty();
      tree.create(
        'angular.json',
        JSON.stringify({
          projects: { [PROJECT_NAME]: { projectType: 'pokemon' } }
        })
      );

      expect(() =>
        ngAdd(ADD_OPTIONS)(tree, {} as SchematicContext)
      ).toThrowError('Deploy requires an Angular project type of "application" in angular.json');
    });

    it('Should throw if app does not have architect configured', async () => {
      const tree = Tree.empty();
      tree.create(
        'angular.json',
        JSON.stringify({
          projects: { [PROJECT_NAME]: { projectType: 'application' } }
        })
      );

      expect(() =>
        ngAdd(ADD_OPTIONS)(tree, {} as SchematicContext)
      ).toThrowError('Cannot read the output path (architect.build.options.outputPath) of the Angular project "pie-ka-chu" in angular.json');
    });
  });
});

function generateAngularJson() {
  return {
    defaultProject: PROJECT_NAME,
    projects: {
      [PROJECT_NAME]: {
        projectType: 'application',
        root: PROJECT_ROOT,
        architect: {
          build: {
            options: {
              outputPath: 'dist/ikachu'
            }
          }
        }
      },
      [OTHER_PROJECT_NAME]: {
        projectType: 'application',
        root: PROJECT_ROOT,
        architect: {
          build: {
            options: {
              outputPath: 'dist/ikachu'
            }
          }
        }
      }
    }
  };
}

const initialAngularJson = `{
  "defaultProject": "pie-ka-chu",
  "projects": {
    "pie-ka-chu": {
      "projectType": "application",
      "root": "pirojok",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/ikachu"
          }
        },
        "deploy": {
          "builder": "ngx-heroku-deploy:deploy",
          "options": {
            "herokuApiToken": "4fw5ef45",
            "appName": "example"
          }
        }
      }
    },
    "pi-catch-you": {
      "projectType": "application",
      "root": "pirojok",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/ikachu"
          }
        }
      }
    }
  }
}`;

const overwriteAngularJson = `{
  "defaultProject": "pie-ka-chu",
  "projects": {
    "pie-ka-chu": {
      "projectType": "application",
      "root": "pirojok",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/ikachu"
          }
        },
        "deploy": {
          "builder": "ngx-heroku-deploy:deploy",
          "options": {
            "herokuApiToken": "4fw5ef45",
            "appName": "example"
          }
        }
      }
    },
    "pi-catch-you": {
      "projectType": "application",
      "root": "pirojok",
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/ikachu"
          }
        },
        "deploy": {
          "builder": "ngx-heroku-deploy:deploy",
          "options": {
            "herokuApiToken": "4fw5ef45",
            "appName": "example"
          }
        }
      }
    }
  }
}`;

