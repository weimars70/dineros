import { IDatabase, IMain } from 'pg-promise';
import 'reflect-metadata';
import { createDependencyContainerTest, DEPENDENCY_CONTAINER_TEST } from './mocks';
import { DBDinerosMem } from './mocks/postgresql';
import axios from 'axios';
import { createDependencyContainer, DEPENDENCY_CONTAINER, TYPES } from '@configuration';

jest.mock('axios');
export const mockApiAxios = axios as jest.MockedFunction<typeof axios>;

beforeAll(() => {
    createDependencyContainer();
    createDependencyContainerTest();
    const dbDineros = DBDinerosMem();

    // Databases -Postgres
    DEPENDENCY_CONTAINER.rebind<IDatabase<IMain>>(TYPES.Pg).toConstantValue(dbDineros);
});

afterAll(() => {
    if (DEPENDENCY_CONTAINER) {
        DEPENDENCY_CONTAINER.unbindAll();
    }
    if (DEPENDENCY_CONTAINER_TEST) {
        DEPENDENCY_CONTAINER_TEST.unbindAll();
    }
});

afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockApiAxios.mockReset();
    mockApiAxios.mockRestore();
});

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    mockApiAxios.mockReset();
    mockApiAxios.mockRestore();
});
