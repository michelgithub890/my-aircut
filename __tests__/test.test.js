import { sentence } from "@/app/test/page"

describe('Palindrom', () => {

    it('should retrieve a sentence', () => {
        expect(sentence.length).toBeGreaterThan(0)
    })

    it('should have 11 caractères', () => {
        expect(sentence.length).toEqual(11)
    })
})

/*

npm t
› Press a to run all tests.
› Press f to run only failed tests.
› Press p to filter by a filename regex pattern.
› Press t to filter by a test name regex pattern.
› Press q to quit watch mode.
› Press Enter to trigger a test run. (lance tous les tests)

*/