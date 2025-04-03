import getPages from '@/components/etsin/Search/pagination/getPages'

// prettier-ignore
describe('getPages', () => {
  it('should return only 1 page', () => {
    getPages({ pageCount: 1, currentPage: 1 }).should.eql([1])
  })

  it('should show next button', () => {
    getPages({ pageCount: 3, currentPage: 1 }).should.eql([1, 2, 3, '>'])
  })

  it('should show previous button', () => {
    getPages({ pageCount: 3, currentPage: 3 }).should.eql(['<', 1, 2, 3])
  })

  it('should show all pages', () => {
    getPages({ pageCount: 9, currentPage: 5 }).should.eql(['<', 1, 2, 3, 4, 5, 6, 7, 8, 9, '>'])
  })

  it('should hide pages from start', () => {
    getPages({ pageCount: 10, currentPage: 10 }).should.eql(['<', 1, '...', 4, 5, 6, 7, 8, 9, 10])
  })

  it('should hide pages from end', () => {
    getPages({ pageCount: 10, currentPage: 1 }).should.eql([1, 2, 3, 4, 5, 6, 7, '...', 10, '>'])
  })

  it('should show pages around currentPage', () => {
    getPages({ pageCount: 11, currentPage: 6 }).should.eql(['<', 1, '...', 4, 5, 6, 7, 8, '...', 11, '>'])
  })

  it('should support changing windowSize',  () => {
    getPages({ pageCount: 200, currentPage: 129, windowSize: 3 }).should.eql(
      ['<', 1, '...', 126, 127, 128, 129, 130, 131, 132, '...', 200, '>']
    )
  })

  it('should support changing margin', () => {
    getPages({ pageCount: 12, currentPage: 12, margin: 4 }).should.eql(['<', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })
})
