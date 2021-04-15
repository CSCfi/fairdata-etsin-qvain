import 'chai/register-expect'
import { ActorsRef } from '../../../js/stores/view/qvain/qvain.actors'

describe('ActorsRef', () => {
  describe('given existing actors', () => {
    let actorsRef
    const actors = {
      actors: [
        { uiid: 1, roles: ['mother', 'Ph.D. in Math'] },
        { uiid: 2, roles: ['father', 'cleaner'] },
      ],
    }
    const actorsFromBackend = []
    const roles = []

    beforeEach(() => {
      actorsRef = new ActorsRef({ actors, actorsFromBackend, roles })
    })

    describe('when calling constructor', () => {
      test('should assign args to respective props', () => {
        actorsRef.actors.should.eql(actors)
        actorsRef.roles.should.eql(roles)
      })
    })

    describe('when calling clone', () => {
      let returnValue

      beforeEach(() => {
        returnValue = actorsRef.clone()
      })

      test('should return a copy of actorsRef', () => {
        returnValue.should.deep.eql(actorsRef)
        returnValue.should.not.equal(actorsRef)
      })
    })

    describe('when calling setActorsRef with set of actors', () => {
      const existingActor = actors.actors[0]

      beforeEach(() => {
        actorsRef.setActorsRef([existingActor], ['citizen'])
      })

      test('should set actorsRef', () => {
        const expectedActorsRef = {
          1: { uiid: 1, roles: ['mother', 'Ph.D. in Math'] },
          2: { uiid: 2, roles: ['father', 'cleaner'] },
        }
        actorsRef.actorsRef.should.deep.eql(expectedActorsRef)
      })
    })

    describe('when calling addRefsOnlyToActors with actors that are not in actors', () => {
      const actorsRefRef = [{}, actors.actors[0]]

      beforeEach(() => {
        actorsRef.addRefsOnlyToActors(actorsRefRef)
      })

      test.skip("should add actors, that aren't in the actors", () => {
        // but it doesn't
        // isActorEqual says that empty object is equal with {uiid:1, roles: ["mother", "Ph.D. in Math"]}
        actorsRef.actors.actors.should.include(actorsRefRef[0])
      })
    })

    describe('when calling addActorRef with actor', () => {
      const actorToBeAdded = {
        uiid: 3,
        roles: ['kid', 'student'],
      }

      beforeEach(() => {
        actorsRef.addActorRef(actorToBeAdded)
      })

      test('should add actor to actorsRef', () => {
        actorsRef.actorsRef.should.deep.include({ 3: actorToBeAdded })
      })
    })

    describe('when calling addActorWithId', () => {
      beforeEach(() => {
        actorsRef.actorsRef = {}
        actorsRef.addActorWithId(2)
      })

      test('should add matching actor to actorsRef', () => {
        actorsRef.actorsRef.should.deep.include({
          2: { uiid: 2, roles: ['father', 'cleaner', 'citizen'] },
        })
      })
    })

    describe('given actors in actorsRef', () => {
      beforeEach(() => {
        actorsRef.actorsRef = {
          1: {
            type: 'person',
            uiid: 1,
            person: {
              name: 'Selvi Sipuli',
              email: 'selvi.sipuli@onionhaslayers.com',
              identifier: 'identifier',
            },
            organizations: [
              {
                name: 'org',
                email: 'org@org.net',
                identifier: 'identifier',
              },
            ],
            roles: ['mother', 'Ph.D. in Math'],
          },
        }
      })
      describe('when accessing computed actorOptions', () => {
        test('should return options that are fit for select element', () => {
          actorsRef.actorOptions.should.deep.eql([
            { value: 1, label: 'Selvi Sipuli', roles: ['mother', 'Ph.D. in Math'] },
          ])
        })

        describe('when accessing computed toBackend', () => {
          test('should return actorsRef ready for backend', () => {
            actorsRef.toBackend.should.deep.eql([
              {
                type: 'person',
                roles: ['mother', 'Ph.D. in Math'],
                person: {
                  name: 'Selvi Sipuli',
                  email: 'selvi.sipuli@onionhaslayers.com',
                  identifier: 'identifier',
                },
                organizations: [
                  {
                    name: 'org',
                    email: 'org@org.net',
                    identifier: 'identifier',
                  },
                ],
              },
            ])
          })
        })

        describe('when calling addRole with id and role', () => {
          const id = 1
          const role = 'grandmother'

          beforeEach(() => {
            const actors = {
              actors: [
                { uiid: 1, roles: ['mother', 'Ph.D. in Math'] },
                { uiid: 2, roles: ['father', 'cleaner'] },
              ],
            }

            actorsRef.actors = actors
            actorsRef.addRole(id, role)
          })

          test('should add role to actor with matching id', () => {
            const roles = actorsRef.actors.actors[0].roles
            roles.should.include('grandmother')
          })
        })

        describe('when calling addRoleForAll with role', () => {
          beforeEach(() => {
            actorsRef.actors.actors = Object.values(actorsRef.actorsRef)
            actorsRef.addRoleForAll('test')
          })

          test('should add role for all actor in actorsRef', () => {
            actorsRef.actorsRef[1].roles.should.include('test')
          })
        })

        describe('when calling removeActorRef with id', () => {
          beforeEach(() => {
            actorsRef.actorsRef = { 1: { uiid: 1, roles: [] } }
            actorsRef.removeActorRef(1)
          })
          test('should remove actor with matching id from actorsRef', () => {
            actorsRef.actorsRef.should.eql({})
          })
        })

        describe('when calling clearActorsRef', () => {
          beforeEach(() => {
            actorsRef.actorsRef = { 1: { uiid: 1, roles: [] }, 2: {} }
            actorsRef.clearActorsRef(1)
          })
          test('should clear actorsRef', () => {
            actorsRef.actorsRef.should.eql({})
          })
        })
      })
    })
  })
})
