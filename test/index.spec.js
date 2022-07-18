import { jest } from '@jest/globals'
import Loadero from "../src";

describe('endpoints', () => {

    describe('projects', () => {

        test('are listed', async () => {
            const log = jest.spyOn(console, 'log')
            const projects = await new Loadero().listProjects()

            expect(log).toHaveBeenCalledWith(expect.stringContaining('implemented'))
        })

    })

})