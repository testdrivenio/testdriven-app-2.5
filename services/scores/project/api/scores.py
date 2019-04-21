# services/scores/project/api/scores.py


from sqlalchemy import exc
from flask import Blueprint, request, jsonify
from flask_restful import Resource, Api

from project import db
from project.api.models import Score
from project.api.utils import authenticate_restful


scores_blueprint = Blueprint('scores', __name__)
api = Api(scores_blueprint)


@scores_blueprint.route('/scores/ping', methods=['GET'])
def ping_pong():
    return jsonify({
        'status': 'success',
        'message': 'pong!'
    })


class ScoresList(Resource):

    method_decorators = {'post': [authenticate_restful]}

    def get(self):
        """Get all scores"""
        response_object = {
            'status': 'success',
            'data': {
                'scores': [
                    score.to_json() for score in Score.query.all()
                ]
            }
        }
        return response_object, 200

    def post(self, resp):
        """Add score"""
        response_object = {
            'status': 'fail',
            'message': 'Invalid payload.'
        }
        if not resp['admin']:
            response_object = {
                'status': 'error',
                'message': 'You do not have permission to do that.'
            }
            return response_object, 401
        post_data = request.get_json()
        if not post_data:
            return response_object, 400
        exercise_id = post_data.get('exercise_id')
        correct = False
        if post_data.get('correct'):
            correct = post_data.get('correct')
        try:
            db.session.add(
                Score(
                    user_id=resp['data']['id'],
                    exercise_id=exercise_id,
                    correct=correct
                )
            )
            db.session.commit()
            response_object['status'] = 'success'
            response_object['message'] = 'New score was added!'
            return response_object, 201
        except exc.IntegrityError:
            db.session.rollback()
            return response_object, 400
        except (exc.IntegrityError, ValueError):
            db.session.rollback()
            return response_object, 400


class ScoresViaUser(Resource):

    method_decorators = {'get': [authenticate_restful]}

    def get(self, resp):
        """Get all scores by user id"""
        scores = Score.query.filter_by(user_id=int(resp['data']['id'])).all()
        response_object = {
            'status': 'success',
            'data': {
                'scores': [score.to_json() for score in scores]
            }
        }
        return response_object, 200


class ScoreViaExercise(Resource):

    method_decorators = {'put': [authenticate_restful]}

    def put(self, resp, exercise_id):
        """Update score"""
        post_data = request.get_json()
        response_object = {
            'status': 'fail',
            'message': 'Invalid payload.'
        }
        if not post_data:
            return response_object, 400
        correct = post_data.get('correct')
        try:
            score = Score.query.filter_by(
                exercise_id=int(exercise_id),
                user_id=int(resp['data']['id'])
            ).first()
            if score:
                score.correct = correct
                db.session.commit()
                response_object['status'] = 'success'
                response_object['message'] = 'Score was updated!'
                return response_object, 200
            else:
                db.session.add(Score(
                    user_id=resp['data']['id'],
                    exercise_id=int(exercise_id),
                    correct=correct))
                db.session.commit()
                response_object['status'] = 'success'
                response_object['message'] = 'New score was added!'
                return response_object, 201
        except (exc.IntegrityError, ValueError, TypeError):
            db.session().rollback()
            return response_object, 400


class ScoreViaUser(Resource):

    method_decorators = {'get': [authenticate_restful]}

    def get(self, resp, score_id):
        """Get single score by user id"""
        response_object = {
            'status': 'fail',
            'message': 'Score does not exist'
        }
        try:
            score = Score.query.filter_by(
                id=int(score_id),
                user_id=int(resp['data']['id'])
            ).first()
            if not score:
                return response_object, 404
            else:
                response_object = {
                    'status': 'success',
                    'data': score.to_json()
                }
                return response_object, 200
        except ValueError:
            return response_object, 404


api.add_resource(ScoresList, '/scores')
api.add_resource(ScoresViaUser, '/scores/user')

api.add_resource(ScoreViaExercise, '/scores/<exercise_id>')
api.add_resource(ScoreViaUser, '/scores/user/<score_id>')
