import AIConnectifyError from '../../../lib/AIConnectifyError';
import DALLE from '../../../lib/connectors/AI/DALLE/DALLE';
import DALLEClient from '../../../lib/connectors/AI/DALLE/DALLEClient';

jest.mock('../../../lib/connectors/AI/DALLE/DALLEClient');

describe("DALLE class", () => {
    const mockApiKey = 'TEST_API_KEY_WITH_16_CHARACTERS';
    let dalle;
    let mockClientInstance;
  
    beforeEach(() => {
        mockClientInstance = {
            setOrganizationId: jest.fn(),
            setProjectId: jest.fn(),
            getModels: jest.fn(),
            getModel: jest.fn(),
            createImage: jest.fn(),
            createImageEdit: jest.fn(),
            createImageVariation: jest.fn(),
        };
        DALLEClient.mockImplementation(() => mockClientInstance);
        dalle = new DALLE(mockApiKey);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
  
    describe("Create new instance", () => {
        it("Test to create an instance correctly", () => {
            expect(dalle).toBeInstanceOf(DALLE);
            expect(DALLEClient).toHaveBeenCalledWith(mockApiKey);
        });
    });

    describe("Use each method individually", () => {
        it("Test call 'setOrganizationId' on the client instance", () => {
            const orgId = 'test-org-id';
            dalle.setOrganizationId(orgId);
            expect(mockClientInstance.setOrganizationId).toHaveBeenCalledWith(orgId);
        });
        it("Test call 'setProjectId' on the client instance", () => {
            const projectId = 'test-project-id';
            dalle.setProjectId(projectId);
            expect(mockClientInstance.setProjectId).toHaveBeenCalledWith(projectId);
        });
        it("Test call 'getModels' on the client instance", async () => {
            const mockModels = [{ id: 'model1' }, { id: 'model2' }];
            mockClientInstance.getModels.mockResolvedValue(mockModels);
            
            const result = await dalle.getModels();
            expect(result).toEqual(mockModels);
            expect(mockClientInstance.getModels).toHaveBeenCalled();
        });
        it("Test call 'getModel' on the client instance with the correct modelID", async () => {
            const modelId = 'test-model-id';
            const mockModel = { id: modelId, name: 'Test Model' };
            mockClientInstance.getModel.mockResolvedValue(mockModel);
            
            const result = await dalle.getModel(modelId);
            expect(result).toEqual(mockModel);
            expect(mockClientInstance.getModel).toHaveBeenCalledWith(modelId);
        });
        it("Test call 'createImage' on the client instance with correct parameters", async () => {
            const prompt = 'test prompt';
            const modelId = 'test-model-id';
            const config = { size: '1024x1024' };
            const mockResponse = { data: [{ url: 'http://example.com/image.png' }] };
            mockClientInstance.createImage.mockResolvedValue(mockResponse);
            
            const result = await dalle.createImage(prompt, modelId, config);
            expect(result).toEqual(mockResponse);
            expect(mockClientInstance.createImage).toHaveBeenCalledWith(prompt, modelId, config);
        });
        it("Test call 'createImageEdit' on the client instance with correct parameters", async () => {
            const imagePath = '/path/to/image.png';
            const prompt = 'test edit prompt';
            const modelId = 'test-model-id';
            const config = { size: '1024x1024' };
            const mockResponse = { data: [{ url: 'http://example.com/edited-image.png' }] };
            mockClientInstance.createImageEdit.mockResolvedValue(mockResponse);
            
            const result = await dalle.createImageEdit(imagePath, prompt, modelId, config);
            expect(result).toEqual(mockResponse);
            expect(mockClientInstance.createImageEdit).toHaveBeenCalledWith(imagePath, prompt, modelId, config);
        });
        it("Test call 'createImageVariation' on the client instance with correct parameters", async () => {
            const imagePath = '/path/to/image.png';
            const modelId = 'test-model-id';
            const config = { size: '1024x1024' };
            const mockResponse = { data: [{ url: 'http://example.com/variation-image.png' }] };
            mockClientInstance.createImageVariation.mockResolvedValue(mockResponse);
            
            const result = await dalle.createImageVariation(imagePath, modelId, config);
            expect(result).toEqual(mockResponse);
            expect(mockClientInstance.createImageVariation).toHaveBeenCalledWith(imagePath, modelId, config);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it("Tests when API key is not provided", () => {
            expect(() => new DALLE()).toThrow(AIConnectifyError);
        });
        it("Tests when API key is not valid", () => {
            expect(() => new DALLE('SHORT_API_KEY')).toThrow(AIConnectifyError);
        });
    });    
});